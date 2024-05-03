class FormDataHandler {
  constructor(formId) {
    this.form = document.getElementById(formId);
  }

  getValue(inputName) {
    return this.form.elements[inputName].value.trim();
  }

  setValue(inputName, value) {
    this.form.elements[inputName].value = value;
  }
}
