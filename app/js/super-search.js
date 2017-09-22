"use strict";

class Form {
    constructor(item) {
        this.form = item
        this.searchInput = this.form.querySelector('.search__input_js')
        this.closeBtn = this.form.querySelector('.search__close')
        this.submitBtn = this.form.querySelector('button[type="submit"]')
        this.formId = this.form.getAttribute('id')
        this.dropDown = this.form.querySelector('.search__dropdown')
        this.regexp = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i
        this.msg = {}
        this.url = 'super-analytics.com'
        this.late = new Date()
    }

    addClick() {
        this.form.addEventListener('click', (e) => {
            let target = e.target;

            /*c closest() было б короче*/
            while (target !== this.form) {
                if (target === this.closeBtn) {
                    this.searchInput.value = ''
                    this.searchInput.focus()
                    this.submitBtn.setAttribute('disabled', '')
                    this.dropDown.style.display = 'none'
                    return;
                }
                target = target.parentNode;
            }
        })
    }

    addSubmit() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault()

            let xhr = new XMLHttpRequest(),
                data;

            this.msg.id = this.formId
            this.msg.query = this.searchInput.value.trim()
            data = 'data=' + JSON.stringify(this.msg)

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {

                    if (xhr.status === 200) {
                        console.log(xhr.response)
                    } else {
                        console.log(xhr.status)
                    }
                }
            }
            xhr.open('POST', this.url, true)
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
            xhr.send(data)

            this.searchInput.value = ''
            this.dropDown.style.display = 'none'
            this.submitBtn.setAttribute('disabled', '')
        })
    }

    addOnInput() {
                this.form.addEventListener('input', (e)=> {
            if (e.target === this.searchInput) {
                let val = this.searchInput.value.trim()

                val !== '' ? this.submitBtn.removeAttribute('disabled') : this.submitBtn.setAttribute('disabled', '')

                console.log(this.limitFastInput(this.late, this.searchInput))

                if(!this.limitFastInput(this.late, this.searchInput)) return

                this.late = new Date()

                if (this.regexp.test(val)) {
                    try {
                        let currentUrl = new URL(val)//не поддерживается ie

                        this.setPropToSuggestions(this.dropDown, currentUrl, this.url)
                        this.dropDown.style.display = 'block'
                    } catch(err) {
                        console.log('зактройте ie, потому что: ', err)
                    }
                } else {
                    this.dropDown.style.display = 'none'
                }
            }
        })
    }

    setPropToSuggestions(parent, currentUrl, url) {
        let links = [...parent.querySelectorAll('.search__link')]

        links.forEach(item => {
            let textLink = item.querySelector('.search__link-text')

            switch (item.getAttribute('data-suggestion')) {
                case 'phrase':
                    textLink.innerText = currentUrl.href
                    item.href = `${url}?suggestiontype=phrase&query=${currentUrl.href}`
                    break;
                case 'domain':
                    textLink.innerText = currentUrl.host
                    item.href = `${url}?suggestiontype=domain&query=${currentUrl.host}`
                    break;
                case 'url':
                    textLink.innerText = currentUrl.host + currentUrl.pathname + currentUrl.search
                    item.href = `${url}?suggestiontype=url&query=${currentUrl.host + currentUrl.pathname + currentUrl.search}`
                    console.log(currentUrl.search)
                    break;
            }

        })

    }


     limitFastInput(late, input) {

        let bool =  () => {
            let now = new Date()
            console.log(late, now)

            if ((now - late) < 250) {
                input.setAttribute('maxlength', input.value.length)
                let promise = new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve()
                    }, 250)
                })
                promise.then(() => {
                    input.removeAttribute('maxlength')
                })
                return false
            } else {
                return true
            }
        }
        return bool()
    }

    init() {
        this.addClick()
        this.addSubmit()
        this.addOnInput()
    }
}

class form extends Form {
    constructor(item) {
        super(item)
    }
}


(function () {
    const forms = [...document.querySelectorAll('.search')]

    forms.forEach(item => {
       new form(item).init()
    })

})()

