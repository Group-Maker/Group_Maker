import axios from 'axios';
import { Component } from '../../library/index.js';

export default class SignInSignUp extends Component {
  // setSchema(schema, newSchema) {
  //   schema = { ...schema, ...newSchema };
  //   this.render();
  // }

  toggleValidationResultIcon(inputName, schema) {
    document
      .querySelector(`input[name=${inputName}] ~ .icon-success`)
      ?.classList.toggle('hidden', !schema[inputName].valid);

    document
      .querySelector(`input[name=${inputName}] ~ .icon-error`)
      ?.classList.toggle('hidden', schema[inputName].valid);
  }

  setErrorMessage(inputName, schema) {
    document.querySelector(`input[name=${inputName}] ~ .error`).textContent = schema[inputName].valid
      ? ''
      : schema[inputName].error;
  }

  activateSubmitButton(schema) {
    document.querySelector('.submit-btn').disabled = !schema.valid;
  }

  // TODO: debounce 적용
  validate(e, schema) {
    const { name, value } = e.target;

    schema[name].value = value.trim();
    // 사용자가 입력필드의 값을 변경해 schema의 dirty가 true로 변경된 입력필드만 유효성 검증한다.
    schema[name].dirty = true;

    Object.keys(schema)
      .filter(name => name !== 'valid' && schema[name].dirty)
      .forEach(name => {
        this.toggleValidationResultIcon(name, schema);
        this.setErrorMessage(name, schema);
      });

    this.activateSubmitButton(schema);
  }

  // async request(e) {
  //   e.preventDefault();

  //   // const payload = { email: $form.userid.value, password: $form.password.value };
  //   const payload = [...new FormData($currentForm)].reduce(
  //     // eslint-disable-next-line no-return-assign, no-sequences
  //     (obj, [key, value]) => ((obj[key] = value), obj),
  //     {}
  //   );

  //   try {
  //     // request with payload & move to another page
  //     const { data: user } = await axios.post(`/auth/${currentForm}`, payload);

  //     console.log('😀 LOGIN SUCCESS!');
  //     console.log(user);

  //     if (user) {
  //       window.location.href = '/';
  //     }
  //   } catch (e) {
  //     // login 실패...
  //     console.log('😱 LOGIN FAILURE..');
  //     toaster.append({ type: TOAST_TYPE.ERROR, title: '로그인 실패', message: e.response.data.error });
  //   }
  // }

  setEvent() {
    return [
      {
        type: 'click',
        selector: '.switchSignInSignUp',
        handler: e => {
          e.preventDefault();
          console.log('!!!');
          const path = e.target.getAttribute('href');
          this.props.navigate(path);
        },
      },
    ];
  }
}
