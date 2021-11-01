import moment from "moment";

export function name(name) {
  return new Promise((resolve, reject) => {

    const normalizedName = name.trim();

    if (!(/^[а-яё]{3,}$/i.test(normalizedName))) {
      reject({
        field: 'name',
        message: 'Имя не должно быть пустым и содержать только имя: кириллические символы и не менее 3-х символов / Да, мы знаем про имя Ян, но увы =)'
      });
    }

    resolve(normalizedName);

  });
}

export function phone(phone) {
  return new Promise((resolve, reject) => {

    const normalizedPhone = '+7' + phone.replace(/\D+/g, '').replace(/^[78]/g, '');

    if (!(/^\+79\d{9}$/.test(normalizedPhone))) {
      reject({
        field: 'phone',
        message: 'Введите телефон в формате +79990000000'
      });
      return;
    }

    resolve(normalizedPhone);

  });
}

export function date(date) {
  return new Promise((resolve, reject) => {

    if (!((/^\d{2}-\d{2}-\d{4}$/.test(date)) && moment(date, "DD-MM-YYYY").isValid())) {
      reject({
        field: 'date',
        message: 'Введите дату в формате ДД-ММ-ГГГГ'
      });
    }

    if (!(moment(date, "DD-MM-YYYY").isSameOrAfter('1940-01-01'))) {
      reject({
        field: 'date',
        message: 'Введите дату не ранее 01-01-1940'
      });
    }

    if (!(moment(date, "DD-MM-YYYY").isSameOrBefore('2021-01-01'))) {
      reject({
        field: 'date',
        message: 'Введите дату не позднее 01-01-2021'
      });
    }

    resolve(date);

  });
}
