import invalids from '../invalids';

export default class PopupForm {
  constructor() {
    this.element = document.createElement('form');
    this.element.setAttribute('id', 'popup-form');
    this.element.noValidate = true;
    this.element.autocomplete = 'off';

    this.invalid = document.createElement('div');
    this.invalid.classList.add('invalid');

    this.onCancelBtnClick = this.onCancelBtnClick.bind(this);
    this.onInputFocus = this.onInputFocus.bind(this);

    this.editingItemId = null;
  }

  onInputFocus(e) {
    if (e.target.classList.contains('invalid-input')) {
      this.invalid.remove();
      e.target.classList.remove('invalid-input');
    }
  }

  isValid() {
    const inputElements = [...this.element.querySelectorAll('input')];
    return !inputElements.some((el) => Object.keys(ValidityState.prototype).some((key) => {
      if (!el.checkValidity() && el.validity[key]) {
        el.classList.add('invalid-input');
        this.showError(el, invalids[el.name][key]);
        return true;
      }
      return false;
    }));
  }

  showError(el, errMessage) {
    this.invalid.textContent = errMessage;
    el.after(this.invalid);
  }

  onCancelBtnClick() {
    this.element.reset();
    this.invalid.remove();
    this.element.closest('.popup-wrapper').classList.remove('active');
    this.editingItemId = null;

    if (this.element.querySelector('.invalid-input')) {
      this.element.querySelector('.invalid-input').classList.remove('invalid-input');
    }
  }

  build() {
    const labelName = document.createElement('label');
    labelName.textContent = 'Название';

    const inputName = document.createElement('input');
    inputName.setAttribute('name', 'name');
    inputName.required = true;

    labelName.append(inputName);

    const labelPrice = document.createElement('label');
    labelPrice.textContent = 'Цена';

    const inputPrice = document.createElement('input');
    inputPrice.setAttribute('name', 'price');
    inputPrice.required = true;
    inputPrice.setAttribute('pattern', '^[1-9][0-9]*$');

    labelPrice.append(inputPrice);

    const btns = document.createElement('div');
    btns.classList.add('btns');

    const saveBtn = document.createElement('button');
    saveBtn.setAttribute('type', 'submit');
    saveBtn.classList.add('saveBtn');
    saveBtn.textContent = 'Сохранить';

    const cancelBtn = document.createElement('button');
    cancelBtn.setAttribute('type', 'button');
    cancelBtn.textContent = 'Отмена';
    cancelBtn.addEventListener('click', this.onCancelBtnClick);

    btns.append(saveBtn, cancelBtn);

    this.element.append(labelName, labelPrice, btns);

    const popupWrap = document.createElement('div');
    popupWrap.classList.add('popup-wrapper');
    popupWrap.append(this.element);
    document.body.append(popupWrap);

    this.element.querySelectorAll('input').forEach((el) => {
      el.addEventListener('focus', this.onInputFocus);
    });
  }
}
