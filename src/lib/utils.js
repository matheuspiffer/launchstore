module.exports = {
    date(timestamp) {
        const date = new Date(timestamp)
        const year = date.getFullYear()
        const month = date.getMonth() + 1 < 10 ? `0${date.getUTCMonth() + 1}` : date.getUTCMonth() + 1
        const day = `0${date.getDate()}`.slice(-2)
        const hour = date.getHours()
        const minutes = date.getMinutes()
        return {
            day,
            month,
            year,
            hour,
            minutes,
            iso: `${year}-${month}-${day}`,
            birthDay: day + '/' + month,
            format: `${day}/${month}/${year}`

        }
    },
    formatPrice(price) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price / 100)
    },

    formatCep(value){
        value = value.replace(/\D/g, "")
        if (value.length > 8) {
            value = value.slice(0, -1)
        }//88338-570
        value = value.replace(/(\d{5})(\d)/, "$1-$2")
        return value
    },
    formatCpfCnpj(value) {
        value = value.replace(/\D/g, "")
        if (value.length > 14) {
            value = value.slice(0, -1)
        }
        //check if it is CNPJ
        if (value.length > 11) {
            value = value.replace(/(\d{2})(\d)/, "$1.$2")
            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            value = value.replace(/(\d{3})(\d)/, "$1/$2")
            value = value.replace(/(\d{4})(\d)/, "$1-$2")
        } else {
            //cpf 125.974.267.93
            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            value = value.replace(/(\d{3})(\d)/, "$1-$2")
        }
        return value
    }
}
