"use strict";

(function () {
    const forms = [...document.querySelectorAll('.search')],
        url = 'super-analytics.com'

    if(forms) {
        forms.forEach(item => {
            let searchInput = item.querySelector('.search__input_js'),
                closeBtn = item.querySelector('.search__close'),
                submitBtn = item.querySelector('button[type="submit"]'),
                formId = item.getAttribute('id'),
                dropDown = item.querySelector('.search__dropdown'),
                regexp = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i,
                msg = {},
                late = new Date()


            item.addEventListener('click', function (e) {
                let target = e.target;

                /*c closest() было б короче*/
                while (target !== this) {
                    if (target === closeBtn) {
                        searchInput.value = ''
                        searchInput.focus()
                        submitBtn.setAttribute('disabled', '')
                        dropDown.style.display = 'none'
                        return;
                    }
                    target = target.parentNode;
                }
            })

            item.addEventListener('submit', function (e) {
                e.preventDefault()

                let xhr = new XMLHttpRequest(),
                    data;

                msg.id = formId
                msg.query = searchInput.value.trim()
                data = 'data=' + JSON.stringify(msg)

                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {

                        if (xhr.status === 200) {
                            console.log(xhr.response)
                        } else {
                            console.log(xhr.status)
                        }
                    }
                }
                xhr.open('POST', url, true)
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
                xhr.send(data)

                searchInput.value = ''
                dropDown.style.display = 'none'
                submitBtn.setAttribute('disabled', '')
            })

            item.addEventListener('input', function (e) {
                if (e.target === searchInput) {
                    let val = searchInput.value.trim()

                    val !== '' ? submitBtn.removeAttribute('disabled') : submitBtn.setAttribute('disabled', '')

                    console.log(limitFastInput(late, searchInput))

                    if(!limitFastInput(late, searchInput)) return

                    late = new Date()

                    if (regexp.test(val)) {
                        try {
                            let currentUrl = new URL(val)//не поддерживается ie

                            setPropToSuggestions(dropDown, currentUrl, url)
                            dropDown.style.display = 'block'
                        } catch(err) {
                            console.log('зактройте ie, потому что: ', err)
                        }
                    } else {
                        dropDown.style.display = 'none'
                    }
                }
            })
        })
    }
})()

function setPropToSuggestions(parent, currentUrl, url) {
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


function limitFastInput(late, input) {

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