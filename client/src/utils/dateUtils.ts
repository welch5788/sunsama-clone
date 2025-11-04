export function getWeekDates(date: Date = new Date()): Date[] {
    const dates: Date[] = [];
    const current = new Date(date);

    // get to Monday (week start)
    const day = current.getDay();
    const diff = day === 0 ? -6 : 1 - day; // day === Sunday (go back 6)
    current.setDate(current.getDate() + diff);

    for (let i = 0; i < 7; i++) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }
    return dates;
}

export function formatWeekRange(dates: Date[]): string {
    const first = dates[0];
    const last = dates[6];

    const firstMonth = first.toLocaleDateString('en-US', {month: 'short'});
    const lastMonth = last.toLocaleDateString('en-US', {month: 'short'});

    if (firstMonth === lastMonth) {
        return `${firstMonth} ${first.getDate()}-${last.getDate()}`;
    }

    return `${firstMonth} ${first.getDate()} - ${lastMonth} ${last.getDate()}`;
}