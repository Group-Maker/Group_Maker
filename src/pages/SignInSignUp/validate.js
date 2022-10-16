function toggleValidationResultIcon(inputName, schema) {
  document
    .querySelector(`input[name=${inputName}] ~ .icon-success`)
    ?.classList.toggle('hidden', !schema[inputName].valid);

  document.querySelector(`input[name=${inputName}] ~ .icon-error`)?.classList.toggle('hidden', schema[inputName].valid);
}

function setErrorMessage(inputName, schema) {
  document.querySelector(`input[name=${inputName}] ~ .error`).textContent = schema[inputName].valid
    ? ''
    : schema[inputName].error;
}

function activateSubmitButton(schema) {
  document.querySelector('.submit-btn').disabled = !schema.valid;
}

// TODO: debounce 적용
function validate(e, schema) {
  const { name, value } = e.target;

  schema[name].value = value.trim();
  // 사용자가 입력필드의 값을 변경해 schema의 dirty가 true로 변경된 입력필드만 유효성 검증한다.
  schema[name].dirty = true;

  Object.keys(schema)
    .filter(name => name !== 'valid' && schema[name].dirty)
    .forEach(name => {
      toggleValidationResultIcon(name, schema);
      setErrorMessage(name, schema);
    });

  activateSubmitButton(schema);
}

export default validate;
