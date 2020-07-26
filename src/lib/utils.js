module.exports = {
    date(timestamp) {
        const date = new Date(timestamp)
        const year = date.getUTCFullYear()
        const month = date.getUTCMonth() + 1 < 10 ? `0${date.getUTCMonth() + 1}` : date.getUTCMonth() + 1
        const day = `0${date.getUTCDate()}`.slice(-2)
        return {
            day,
            month,
            year,
            iso: `${year}-${month}-${day}`,
            birthDay: day + '/' + month,
            format: `${day}/${month}/${year}`

        }
    }
} 