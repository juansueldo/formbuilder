# FormBuilder

FormBuilder is a versatile JavaScript library that allows you to dynamically create and manage forms with a visual interface. It provides real-time previews, multilingual support, and flexible customization options.

## Features

- Visual form builder interface
- Real-time form preview
- Multi-language support (English, Spanish, French, German)
- Multiple field types support (text, number, email, date, checkbox, radio, select, textarea)
- Field reordering, editing, and deletion
- JSON import/export functionality
- Highly customizable

## Installation

Include the FormBuilder JavaScript file in your HTML:

```html
<script src="path/to/formbuilder.js"></script>
```

Add the necessary CSS for optimal display:

```html
<link rel="stylesheet" href="path/to/formbuilder.css">
```

## Basic Usage

```javascript
// Create a container element
const container = document.getElementById('formBuilder');

// Initialize FormBuilder
const formBuilder = new FormBuilder({
  container: container,
  lang: 'en'  // 'en', 'es', 'fr', or 'de'
});
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `container` | HTMLElement | null | Container element for the FormBuilder (required) |
| `inputHidden` | String | 'jsonForm' | ID for the hidden input that stores the form JSON |
| `previewOnly` | Boolean | false | Show only the form preview (no builder interface) |
| `allowedFields` | Array | ['type', 'fieldId', 'label', 'placeholder', 'options', 'help'] | List of configurable fields to show |
| `showFieldControls` | Boolean | true | Show edit/move/delete controls for fields |
| `initialData` | Array | [] | Initial form fields data |
| `onChange` | Function | null | Callback function when form structure changes |
| `enableRealTime` | Boolean | true | Enable real-time preview of fields while editing |
| `lang` | String | 'es' | Interface language ('es', 'en', 'fr', 'de') |

## Field Types

FormBuilder supports the following field types:

- `text` - Text input field
- `number` - Numeric input field
- `email` - Email input field
- `date` - Date picker
- `checkbox` - Checkbox field (with multiple options)
- `radio` - Radio button group
- `select` - Dropdown select field
- `textarea` - Multi-line text area

## Methods

### `getFormData()`
Returns the current form data as a JavaScript object.

```javascript
const formData = formBuilder.getFormData();
console.log(formData);
```

### `setFormData(data)`
Sets the form structure from a JavaScript object.

```javascript
formBuilder.setFormData([
  {
    id: "fullname",
    name: "fullname",
    label: "Full Name",
    type: "text",
    placeholder: "Your full name",
    help: "Please enter your full name"
  },
  {
    id: "email",
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "your@email.com",
    help: "We'll never share your email"
  }
]);
```

### `generateFormHTML()`
Generates HTML code for the current form.

```javascript
const formHTML = formBuilder.generateFormHTML();
document.getElementById('formContainer').innerHTML = formHTML;
```

### `exportFormJSON()`
Exports the form structure as a JSON string.

```javascript
const jsonData = formBuilder.exportFormJSON();
console.log(jsonData);
```

### `importFormJSON(jsonString)`
Imports form structure from a JSON string.

```javascript
const jsonString = '[ { "id": "name", "name": "name", "label": "Name", "type": "text", "placeholder": "Your name", "help": "Please enter your name" } ]';
formBuilder.importFormJSON(jsonString);
```

### `setLanguage(lang)`
Changes the interface language.

```javascript
// Change language to English
formBuilder.setLanguage('en'); // 'en', 'es', 'fr', 'de'
```

## Examples

### Basic Form Builder

```html
<div id="formBuilder"></div>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('formBuilder');
    const formBuilder = new FormBuilder({
      container: container,
      lang: 'en'
    });
  });
</script>
```

### Preview-Only Mode

```javascript
const formBuilder = new FormBuilder({
  container: document.getElementById('formPreview'),
  previewOnly: true,
  initialData: [
    {
      id: "email",
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter your email"
    },
    {
      id: "message",
      name: "message",
      label: "Your Message",
      type: "textarea",
      placeholder: "Type your message here"
    }
  ]
});
```

### Using the onChange Callback

```javascript
const formBuilder = new FormBuilder({
  container: document.getElementById('formBuilder'),
  onChange: function(formData) {
    console.log('Form structure changed:', formData);
    // Update something based on the new structure
  }
});
```

## Handling Form Submission

FormBuilder creates the form structure, but you'll need to handle the form submission yourself:

```javascript
// Generate the HTML form
const formHTML = formBuilder.generateFormHTML();
document.getElementById('formContainer').innerHTML = formHTML;

// Add a submit button and event handler
const form = document.getElementById('formContainer').querySelector('form');
const submitBtn = document.createElement('button');
submitBtn.type = 'submit';
submitBtn.textContent = 'Submit';
form.appendChild(submitBtn);

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(form);
  // Process the form data
  console.log(Object.fromEntries(formData));
});
```

## CSS Customization

FormBuilder uses simple class names that you can style with your own CSS:

```css
.form-builder .field {
  margin-bottom: 15px;
}

.form-builder label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-builder .form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-builder .help-text {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}
```

## Browser Compatibility

FormBuilder works in all modern browsers including:
- Chrome, Firefox, Safari, Edge
- IE11 (with appropriate polyfills for ES6 features)

## License

This project is licensed under the MIT License.