import { nanoid } from 'nanoid';
import PopupForm from './PopupForm';
import edit from '../svg/edit.svg';
import del from '../svg/delete.svg';

export default class ListEditor {
  constructor(parentElement) {
    this.parentElement = parentElement;

    this.element = document.createElement('div');
    this.element.classList.add('list-editor');

    this.form = new PopupForm();

    this.list = [];

    this.onAddBtnClick = this.onAddBtnClick.bind(this);
    this.onPopupSaveBtnClick = this.onPopupSaveBtnClick.bind(this);
    this.onEditBtnClick = this.onEditBtnClick.bind(this);
    this.onDeleteBtnClick = this.onDeleteBtnClick.bind(this);
  }

  onDeleteBtnClick(e) {
    const { target } = e;
    const itemIndexInList = this.list.findIndex((el) => el.id === target.closest('.list-item').dataset.id);
    this.list.splice(itemIndexInList, 1);
    this.updateList();
  }

  onEditBtnClick(e) {
    const { target } = e;
    const inputName = target.closest('.list-item').querySelector('.list-item__name');
    const inputPrice = target.closest('.list-item').querySelector('.list-item__price');

    this.form.element.name.value = inputName.textContent;
    this.form.element.price.value = inputPrice.textContent;
    this.form.element.closest('.popup-wrapper').classList.add('active');

    this.form.editingItemId = target.closest('.list-item').dataset.id;
  }

  updateList() {
    let listHTML = '';
    this.list.forEach((el) => {
      listHTML += `<div class="list-item" data-id=${el.id}>
      <div class="list-item__name">${el.name}</div>
      <div class="list-item__price">${el.price}</div>
      <div>
          <button class="editBtn">
              <img src=${edit} alt="edit">
          </button>
          <button class="deleteBtn">
              <img src=${del} alt="delete">
          </button>
      </div>
      </div>`;
    });
    this.element.querySelector('.list-content').innerHTML = listHTML;
    this.element.querySelectorAll('.editBtn').forEach((el) => el.addEventListener('click', this.onEditBtnClick));
    this.element.querySelectorAll('.deleteBtn').forEach((el) => el.addEventListener('click', this.onDeleteBtnClick));
  }

  onPopupSaveBtnClick(e) {
    e.preventDefault();

    if (this.form.isValid()) {
      const itemIndexInList = this.list.findIndex((el) => el.id === this.form.editingItemId);

      if (itemIndexInList !== -1) {
        this.list[itemIndexInList].name = this.form.element.name.value;
        this.list[itemIndexInList].price = this.form.element.price.value;
      } else {
        this.list.push({
          id: nanoid(),
          name: this.form.element.querySelector('input[name="name"]').value,
          price: this.form.element.querySelector('input[name="price"]').value,
        });
      }
      this.form.onCancelBtnClick();
      this.updateList();
      this.form.editingItemId = null;
    }
  }

  onAddBtnClick() {
    this.form.element.closest('.popup-wrapper').classList.add('active');
  }

  init() {
    this.createHeader('Товары');

    const list = document.createElement('div');
    list.classList.add('list');
    const titles = document.createElement('div');
    titles.classList.add('list-titles');
    titles.innerHTML = `
      <div>Название</div>
      <div>Цена</div>
      <div>Действия</div>
  `;
    list.append(titles);
    this.element.append(list);

    const content = document.createElement('div');
    content.classList.add('list-content');
    list.append(content);

    this.updateList();

    this.parentElement.append(this.element);

    this.form.build();
    this.form.element.querySelector('.btns .saveBtn').addEventListener('click', this.onPopupSaveBtnClick);
  }

  static createBtns(element) {
    const btns = document.createElement('div');
    btns.classList.add('actions-btns');

    const editBtn = document.createElement('button');
    editBtn.classList.add('editBtn');
    const img = document.createElement('img');
    img.setAttribute('src', './svg/edit.svg');
    editBtn.append(img);

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('deleteBtn');
    const img2 = document.createElement('img');
    img2.setAttribute('src', './svg/delete.svg');
    deleteBtn.append(img2);

    btns.append(editBtn, deleteBtn);
    element.append(btns);
  }

  createHeader(title) {
    const header = document.createElement('div');
    header.classList.add('list-editor-header');

    const titleEl = document.createElement('h2');
    titleEl.classList.add('title');
    titleEl.textContent = title;

    const addBtn = document.createElement('button');
    addBtn.classList.add('addBtn');
    addBtn.addEventListener('click', this.onAddBtnClick);

    header.append(titleEl, addBtn);
    this.element.append(header);
  }
}
