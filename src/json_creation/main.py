import json
import re
from collections import deque
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
SOURCE_DIR = REPO_ROOT / 'tmp' / 'pdfs'
OUTPUT_PATH = Path(__file__).resolve().parents[1] / 'files' / 'creekSchedule2627.json'
SUPPORTED_NUM_PERIODS = 8

HEADER_LINES = {
    'MASTER SCHEDULE',
    '2026-2027',
    'Course Name Expression Term Teacher Name Room',
}

IGNORED_LINES = {
    'Cherry Creek High School',
    '9300 East Union Avenue',
    'Greenwood Village, Colorado 80111',
    'Master Schedule',
    'School Year',
    'ENGLISH',
    'AP CAPSTONE',
    'SOCIAL STUDIES',
    'MATH',
    'SCIENCE',
    'WORLD LANGUAGE',
    'FINE ARTS',
    'PE/HEALTH',
    'BUSINESS/FAMILY CONSUMER SCIENCE',
    'ELL',
    'STUDENT ACHIEVEMENT SERVICES',
}

FULL_RECORD_RE = re.compile(
    r'(?P<type>\d)\s+'
    r'(?P<name>.*?)\s+'
    r'(?P<period>\d+(?:-\d+)?)'
    r'\((?P<expression>[^)]*)\)\s+'
    r'(?P<term>26-27|S1|S2)\s+'
    r'(?P<tail>.*?)'
    r'(?=(?:\s+\d\s+.+?\s+\d+(?:-\d+)?\([^)]+\)\s+(?:26-27|S1|S2)\s+)|$)'
)

CONTINUATION_RE = re.compile(
    r'^(?P<period>\d+(?:-\d+)?)'
    r'\((?P<expression>[^)]*)\)\s+'
    r'(?P<term>26-27|S1|S2)\s+'
    r'(?P<tail>.+)$'
)

NAME_ONLY_RE = re.compile(r'^(?P<type>\d)\s+(?P<name>.+)$')

ROOM_PATTERNS = [
    re.compile(r'^(?P<teacher>.+?)\s+(?P<room>Dance Rm)$'),
    re.compile(r'^(?P<teacher>.+?)\s+(?P<room>[A-Z] GYM)$'),
    re.compile(r'^(?P<teacher>.+?)\s+(?P<room>POOL)$'),
    re.compile(r'^(?P<teacher>.+?)\s+(?P<room>[A-Z]{1,3}\d{2,3})$'),
]

ROOM_ONLY_RE = re.compile(r'^(?:Dance Rm|[A-Z] GYM|POOL|[A-Z]{1,3}\d{2,3})$')


def page_sort_key(path):
    return int(path.stem.split('-')[1])


def split_teacher_room(tail):
    tail = tail.strip()
    for pattern in ROOM_PATTERNS:
        match = pattern.match(tail)
        if match:
            return match.group('teacher').strip(), match.group('room').strip()
    return tail, ''


def normalize_name(course_type, raw_name):
    parts = [
        part.strip()
        for part in re.split(rf'\s+{re.escape(course_type)}\s+', raw_name.strip())
        if part.strip()
    ]

    if len(parts) > 1 and len(set(parts)) == 1:
        return parts[0], len(parts) - 1

    return raw_name.strip(), 0


def normalize_term(raw_term):
    return 'Year' if raw_term == '26-27' else raw_term


def normalize_period(raw_period):
    return raw_period if '-' in raw_period else int(raw_period)


def is_supported_period(period):
    if isinstance(period, int):
        return period <= SUPPORTED_NUM_PERIODS

    start, end = period.split('-', 1)
    return int(end) <= SUPPORTED_NUM_PERIODS


def iter_source_lines():
    page_paths = sorted(SOURCE_DIR.glob('page-*.txt'), key=page_sort_key)
    if not page_paths:
        raise FileNotFoundError(f'No extracted PDF page text files found in {SOURCE_DIR}')

    for page_path in page_paths:
        yield page_sort_key(page_path), page_path.read_text().splitlines()


def parse_records():
    records = []
    problems = []

    for page_number, lines in iter_source_lines():
        pending_names = deque()
        pending_rooms = deque()

        for raw_line in lines:
            line = raw_line.strip()

            if (
                not line
                or line in HEADER_LINES
                or line in IGNORED_LINES
                or line.endswith('of 34')
            ):
                continue

            if ROOM_ONLY_RE.match(line):
                if pending_rooms:
                    pending_rooms.popleft()['room'] = line
                else:
                    problems.append((page_number, 'orphan-room', line))
                continue

            matches = list(FULL_RECORD_RE.finditer(line))
            if matches:
                for match in matches:
                    course_type = match.group('type')
                    course_name, extra_name_copies = normalize_name(course_type, match.group('name'))
                    teacher, room = split_teacher_room(match.group('tail'))

                    record = {
                        'type': course_type,
                        'name': course_name,
                        'semester': normalize_term(match.group('term')),
                        'period': normalize_period(match.group('period')),
                        'teacher': teacher,
                        'room': room,
                    }
                    if not is_supported_period(record['period']):
                        continue
                    records.append(record)

                    if room == '':
                        pending_rooms.append(record)

                    for _ in range(extra_name_copies):
                        pending_names.append((course_type, course_name))
                continue

            continuation_match = CONTINUATION_RE.match(line)
            if continuation_match and pending_names:
                course_type, course_name = pending_names.popleft()
                teacher, room = split_teacher_room(continuation_match.group('tail'))

                record = {
                    'type': course_type,
                    'name': course_name,
                    'semester': normalize_term(continuation_match.group('term')),
                    'period': normalize_period(continuation_match.group('period')),
                    'teacher': teacher,
                    'room': room,
                }
                if not is_supported_period(record['period']):
                    continue
                records.append(record)

                if room == '':
                    pending_rooms.append(record)
                continue

            name_only_match = NAME_ONLY_RE.match(line)
            if name_only_match:
                pending_names.append((name_only_match.group('type'), name_only_match.group('name').strip()))
                continue

            problems.append((page_number, 'unparsed', line))

        if pending_names:
            problems.append((page_number, 'dangling-names', list(pending_names)))

        if pending_rooms:
            problems.append((
                page_number,
                'missing-rooms',
                [(record['name'], record['period'], record['teacher']) for record in pending_rooms],
            ))

    serious_problems = [
        problem for problem in problems
        if problem[1] not in {'missing-rooms'}
    ]
    if serious_problems:
        raise ValueError(f'Unexpected parsing problems: {serious_problems[:10]}')

    unique_records = []
    seen = set()
    for record in records:
        signature = (
            record['type'],
            record['name'],
            record['semester'],
            record['period'],
            record['teacher'],
            record['room'],
        )
        if signature in seen:
            continue
        seen.add(signature)
        unique_records.append(record)

    return unique_records


def period_sort_key(period):
    if isinstance(period, int):
        return (period, period)

    start, end = period.split('-', 1)
    return (int(start), int(end))


def build_output(records):
    course_options = []
    seen_options = set()

    for record in records:
        option = (
            record['name'],
            record['type'],
            0 if record['semester'] == 'Year' else 1,
        )
        if option not in seen_options:
            seen_options.add(option)
            course_options.append(option)

    def get_periods(course_name, semester):
        periods = {
            record['period']
            for record in records
            if record['name'] == course_name and record['semester'] == semester
        }
        return sorted(periods, key=period_sort_key)

    def get_matches(course_name, semester, period):
        return [
            {
                'name': record['name'],
                'semester': record['semester'],
                'period': record['period'],
                'teacher': record['teacher'],
                'room': record['room'],
            }
            for record in records
            if record['name'] == course_name
            and record['semester'] == semester
            and record['period'] == period
        ]

    def add_periods(course_name, semester):
        return {
            str(period): get_matches(course_name, semester, period)
            for period in get_periods(course_name, semester)
        }

    output = []
    for name, course_type, term_kind in course_options:
        if term_kind == 0:
            output.append({
                'name': name,
                'type': course_type,
                'year': add_periods(name, 'Year'),
            })
        else:
            output.append({
                'name': name,
                'type': course_type,
                's1': add_periods(name, 'S1'),
                's2': add_periods(name, 'S2'),
            })

    return output


def main():
    records = parse_records()
    output = build_output(records)

    with OUTPUT_PATH.open('w') as outfile:
        json.dump(output, outfile, indent=4)


if __name__ == '__main__':
    main()
