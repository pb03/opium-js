const DOWN_ARROW_KEY_CODE = 40
const UP_ARROW_KEY_CODE = 38
const ESCAPE_KEY_CODE = 27

type ResultItem = {
  name: string
  latest: string
}

/**
 * Package popup
 */
const $package = document.getElementById('package') as HTMLDivElement
const $packageInput = document.getElementById('package-input') as HTMLInputElement
const $loadedList = document.getElementById('loaded-list') as HTMLUListElement
const $addPackageTrigger = document.getElementById('add-package-trigger') as HTMLSpanElement
const $packageForm = document.getElementById('package-form') as HTMLFormElement
const $packageListContainer = document.getElementById('dropdown-container') as HTMLDivElement
const $closePackagePopup = document.getElementById('close-package-popup') as HTMLSpanElement

let _selectedPackageName = ''
let _typingTimeout = null

/**
 * Fetches the list of packages from cdnjs.com
 */
const _fetchPackageList = async () => {
  const searchTerm: string = $packageInput.value
  const response = await fetch(`https://api.cdnjs.com/libraries?search=${searchTerm}`)
  const data = await response.json()
  // Always remove previous dropdown if present
  _removePackageDropdown()
  if (data.results.length) {
    _createDropdown(data.results)
  }
}

/**
 * Filters and returns only JS libraries
 */
const _getFilteredResults = (results: ResultItem[]) => {
  return results.filter(item => /\.js$/.test(item.latest))
}

/**
 * Renders dropdown for the list of packages
 */
const _createDropdown = (results: ResultItem[]) => {
  const $ul = document.createElement('ul')
  $ul.setAttribute('id', 'package-list')
  $ul.setAttribute('class', 'package__list')
  $packageListContainer.appendChild($ul)

  const jsPackages = _getFilteredResults(results)

  for (let i = 0; i < jsPackages.length; i++) {
    const $li = document.createElement('li')
    $li.setAttribute('class', 'package__list-item')
    $li.setAttribute('data-url', jsPackages[i].latest)
    $li.appendChild(document.createTextNode(jsPackages[i].name))
    $li.addEventListener('click', _setSelectedListItem)
    $li.addEventListener('mouseover', _hoverItem)
    $li.addEventListener('mouseout', _unhoverItem)
    $ul.appendChild($li)
  }

  _focusFirstItem()
}

const _handleDropdownNavigation = (e: KeyboardEvent) => {
  const $isDropdownVisible = document.getElementById('package-list')
  if (!$isDropdownVisible) return

  switch (e.keyCode) {
    case DOWN_ARROW_KEY_CODE:
      _focusNextItem()
      return
    case UP_ARROW_KEY_CODE:
      _focusPreviousItem()
      return
    case ESCAPE_KEY_CODE:
      _removePackageDropdown()
      return
  }
}

const _hoverItem = e => {
  e.target.classList.add('is-active')
}

const _unhoverItem = e => {
  e.target.classList.remove('is-active')
}

const _focusFirstItem = () => {
  document.querySelector('.package__list-item').classList.add('is-active')
}

const _getActiveItem = () => {
  return document.querySelector('.package__list-item.is-active') as HTMLLIElement
}

const _focusNextItem = () => {
  const $currentItem: HTMLLIElement = _getActiveItem()
  $currentItem.classList.remove('is-active')
  const { nextSibling } = $currentItem
  if (nextSibling) {
    // @ts-ignore
    nextSibling.classList.add('is-active')
    // @ts-ignore
    nextSibling.scrollIntoView({ block: 'end', behavior: 'smooth' })
  } else {
    _focusFirstItem()
  }
}

const _focusPreviousItem = () => {
  const $currentItem: HTMLLIElement = _getActiveItem()
  const { previousSibling } = $currentItem
  if (previousSibling) {
    $currentItem.classList.remove('is-active')
    // @ts-ignore
    previousSibling.classList.add('is-active')
    // @ts-ignore
    previousSibling.scrollIntoView({ behavior: 'smooth' })
  }
}

/**
 * Selects the package on click
 */
const _setSelectedListItem = e => {
  const url: string = e.target.getAttribute('data-url')
  _removePackageDropdown()
  _selectedPackageName = e.target.innerText
  _opiumLoadJS(url)
}

/**
 * Removes package list dropdown from DOM
 */
const _removePackageDropdown = () => {
  const $dropdown = document.getElementById('package-list')
  if ($dropdown) {
    $dropdown.remove()
  }
}

/**
 * Triggers on Enter press, after filling package url
 */
const _onPackageFormSubmit = (e: KeyboardEvent) => {
  e.preventDefault()
  let url: string
  const activeItem: HTMLLIElement = document.querySelector('.package__list-item.is-active')
  if (activeItem) { // Package selected via keyboard navigation
    url = activeItem.getAttribute('data-url')
    _selectedPackageName = activeItem.innerText
  } else { // Custom url
    url = $packageInput.value
    _selectedPackageName = url.substr(url.lastIndexOf('/') + 1)
  }
  _removePackageDropdown()
  _opiumLoadJS(url)
}

/**
 * Load the selected script
 */
const _opiumLoadJS = async (url: string) => {
  if (!/^https:\/\//.test(url)) return
  const script = document.createElement('script')
  script.src = url
  document.head.appendChild(script)

  const isValid = await _verifyPackage(url)
  _appendToLoadedList(isValid)

  // Clear input after load
  $packageInput.value = ''

  _selectedPackageName = ''
  $packageInput.focus()
}

/**
 * Checks if the package includes DOM operations
 */
const _verifyPackage = async (url: string) => {
  const response = await fetch(url)
  const data = await response.text()
  return !/document\./g.test(data)
}

/**
 * Append package name to the list
 */
const _appendToLoadedList = (isValid: boolean) => {
  const $li = document.createElement('li')
  $li.setAttribute('class', 'loaded-list__item')
  $li.innerHTML = isValid
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 468.293 468.293"><circle cx="234.146" cy="234.146" r="234.146" fill="#73d054"/><path fill="#ebf0f3" d="M357.52 110.145L191.995 275.67l-81.222-81.219-41.239 41.233 122.461 122.464 206.764-206.77z"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 95.098 95.098" fill="#ff8d00"><path d="M47.549 0C21.288 0 0 21.287 0 47.549c0 26.26 21.288 47.549 47.549 47.549 26.262 0 47.549-21.289 47.549-47.549C95.098 21.287 73.811 0 47.549 0zm8.066 80.057c0 .775-.629 1.404-1.405 1.404H40.889c-.775 0-1.404-.629-1.404-1.404V67.738c0-.776.629-1.405 1.404-1.405H54.21c.776 0 1.405.629 1.405 1.405v12.319zm.027-22.28c-.021.762-.644 1.366-1.403 1.366H40.862c-.761 0-1.384-.604-1.404-1.364l-1.18-42.699a1.404 1.404 0 01.397-1.018c.265-.272.627-.426 1.007-.426h15.732c.38 0 .742.153 1.007.426.265.271.407.639.397 1.018l-1.176 42.697z"/></svg>`
  $li.appendChild(document.createTextNode(`${_selectedPackageName} ${isValid ? '' : '(DOM not available)'}`))
  $loadedList.appendChild($li)
}

/**
 * Fetch packages on type
 */
const _handleType = (e: KeyboardEvent) => {
  if (e.keyCode === UP_ARROW_KEY_CODE || e.keyCode === DOWN_ARROW_KEY_CODE) {
    e.preventDefault()
    return
  }

  clearTimeout(_typingTimeout)
  _typingTimeout = setTimeout(() => {
    const $el = e.target as HTMLInputElement
    if ($el.value.length > 2) {
      _fetchPackageList()
    } else {
      _removePackageDropdown()
    }
  }, 500)
}

/**
 * Show/hide package popup
 */
const _togglePackagePopup = () => {
  $package.classList.toggle('popup-visible')

  // Trigger focus after popup animation finishes
  if (!$package.classList.contains('popup-visible')) return
  setTimeout(() => {
    $packageInput.focus()
  }, 100)
}

const _hidePackagePopup = () => {
  $package.classList.remove('popup-visible')
}

$packageInput.onkeyup = _handleType
$packageInput.onkeydown = _handleDropdownNavigation
$addPackageTrigger.onclick = _togglePackagePopup
$packageForm.onsubmit = _onPackageFormSubmit
$closePackagePopup.onclick = _hidePackagePopup

/**
 * Help popup
 */
const $help = document.getElementById('help') as HTMLDivElement
const $helpTrigger = document.getElementById('help-trigger') as HTMLDivElement
const $closeHelp = document.getElementById('close-help') as HTMLSpanElement

$helpTrigger.addEventListener('click', () => {
  $help.classList.toggle('popup-visible')
})

$closeHelp.addEventListener('click', () => {
  $help.classList.remove('popup-visible')
})

/**
 * Removes any visible popup on Esc
 */
document.addEventListener('keyup', (e: KeyboardEvent) => {
  if (e.keyCode === ESCAPE_KEY_CODE) {
    _removePackageDropdown()
    _hidePackagePopup()
    $help.classList.remove('popup-visible')
  }
})
