import {Dialogs, Frame, fromObject} from '@nativescript/core';
import * as Https from '@nativescript-community/https';
import * as phone from 'nativescript-phone';

const viewModel = fromObject({
  contactList: []
});

let page;

function loadList() {
  return new Promise((resolve, reject) => {
    Https.request({
      url: 'https://demo.rgbvision.pro/contacts/get',
      method: 'GET',
      body: [{
        parameterName: "draw",
        data: "0"
      }],
      timeout: 60
    }).then((response) => {
      console.log('Https.request response', response);

      let content;

      // Android returns HttpsResponse.content as string
      if (typeof response.content === "string") {
        content = JSON.parse(response.content);
      }

      // iOS returns HttpsResponse.content as object
      if (typeof response.content === "object") {
        content = response.content;
      }

      if (response.statusCode === 200) {
        page.bindingContext.contactList = content.content.data;
        resolve();
      } else {
        reject(content.message || 'Ошибка подключения к серверу');
      }

    }).catch((error) => {
      console.error('Https.request error', error);
      reject();
    });
  });
}

export function onNavigatingTo(args) {
  page = args.object;
  page.bindingContext = viewModel;
  loadList();
}

export function refreshList(args) {
  loadList().finally(() => {
    args.object.refreshing = false;
  });
}

export function itemTap(args) {
  const itemData = page.bindingContext.contactList[args.index];
  console.log('itemTap ', itemData);

  const actionOptions = {
    title: itemData[0] + " " + itemData[1],
    message: 'Выберите действие',
    cancelButtonText: 'Закрыть',
    actions: ['Позвонить', 'Удалить контакт'],
    cancelable: true // Android only
  }

  Dialogs.action(actionOptions).then(result => {
    console.log('Dialog result: ', result)

    switch (result) {
      case 'Позвонить':
        phone.requestCallPermission("Разрешите приложению совершать звонки.").then(() => {
          phone.dial(itemData[1], false);
        });
        break;
      case 'Удалить контакт':
        Https.request({
          url: 'https://demo.rgbvision.pro/contact/delete',
          method: 'DELETE',
          content: `phone=${encodeURIComponent(itemData[1])}`,
          timeout: 60
        }).then((response) => {
          console.log('Https.request response', response);
          loadList();
        }).catch((error) => {
          console.error('Https.request error', error);
        });
        break;
    }

  });

}

export function fabTap() {
  Frame.topmost().navigate({
    animated: true,
    transition: "fade",
    moduleName: "add-contact-page"
  });
}
