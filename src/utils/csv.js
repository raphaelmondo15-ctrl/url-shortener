export function toCSV(rows) {
    const header = 'clicked_at,referrer,user_agent';

    const lines = rows.map((row) =>
        [
            row.clicked_at,
            row.referrer ?? '',
            row.user_agent ?? ''
        ].join(',')
    );

    return [header, ...lines].join('\n');
}