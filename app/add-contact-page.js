import {Dialogs, Frame, fromObject} from '@nativescript/core';
import * as Validator from './shared/validator';
import * as Https from '@nativescript-community/https';

const viewModel = fromObject({
  firstName: '',
  phone: '',
  date: ''
});

let page;

export function onNavigatingTo(args) {
  page = args.object;
  page.bindingContext = viewModel;
}

function validate() {
  return new Promise((resolve, reject) => {

    Promise.all([
      Validator.name(page.bindingContext.firstName),
      Validator.phone(page.bindingContext.phone),
      Validator.date(page.bindingContext.date)
    ]).then(responses => {
      page.bindingContext.firstName = responses[0];
      page.bindingContext.phone = responses[1];
      resolve();
    }).catch(error => {
      switch (error.field) {
        case 'name':
          page.getViewById('nameInput').focus();
          break;
        case 'phone':
          page.getViewById('phoneInput').focus();
          break;
        case 'date':
          page.getViewById('dateInput').focus();
          break;
      }
      reject(error.message);
    });

  });
}

export function addTap(args) {

  validate().then(() => {

    Https.request({
      url: 'https://demo.rgbvision.pro/contact/add',
      method: 'PUT',
      content: `name=${encodeURIComponent(page.bindingContext.firstName)}&phone=${encodeURIComponent(page.bindingContext.phone)}&date=${encodeURIComponent(page.bindingContext.date)}`,
      timeout: 60
    }).then((response) => {
      console.log('Https.request response', response);
      Frame.topmost().goBack();
    }).catch((error) => {
      console.error('Https.request error', error);
    });

  }).catch((error) => {

    const alertOptions = {
      title: 'Ошибка',
      message: error,
      okButtonText: 'Закрыть',
      cancelable: false // [Android only] Gets or sets if the dialog can be canceled by taping outside of the dialog.
    }

    Dialogs.alert(alertOptions);
  });
}
