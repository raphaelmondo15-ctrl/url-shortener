export function getPagination(rows, cursorField ='clicked_at') {
    return {
        data: rows,
        count: rows.length > 0 ? rows[rows.length - 1][cursorField] : null
    };
}