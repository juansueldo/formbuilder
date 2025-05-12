# FormBuilder.js

FormBuilder.js is a lightweight and flexible JavaScript library for creating dynamic forms. It allows users to build forms interactively through a graphical interface, preview forms in real-time, and export the resulting code.


## Features

- **Intuitive form builder** - Create form fields with a user-friendly interface
- **Real-time preview** - Preview form changes as you edit
- **Support for multiple field types** - Text, number, email, date, checkbox, radio, select, and textarea
- **Internationalization** - Built-in multilanguage support
- **JSON Import/Export** - Save and load form configurations
- **HTML Generation** - Export the HTML code of the generated form
- **Field Controls** - Easily edit, reorder, or delete fields
- **Customizable** - Numerous configuration options
- **Bootstrap Compatible** - Designed to work with Bootstrap 5

## Installation

### Via CDN

```html
<!-- Bootstrap (required) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

<!-- FormBuilder.js -->
<link href="https://example.com/path/to/formbuilder.min.css" rel="stylesheet">
<script src="https://example.com/path/to/formbuilder.min.js"></script>
```

### Local Download

1. Download the `formbuilder.min.js` and `formbuilder.min.css` files
2. Include the files in your project:

```html
<!-- Bootstrap (required) -->
<link href="path/to/bootstrap.min.css" rel="stylesheet">
<script src="path/to/bootstrap.bundle.min.js"></script>

<!-- FormBuilder.js -->
<link href="path/to/formbuilder.min.css" rel="stylesheet">
<script src="path/to/formbuilder.min.js"></script>
```

## Basic Usage

1. Create an HTML container for FormBuilder:

```html
<div id="formBuilder"></div>
```

2. Initialize FormBuilder with JavaScript:

```javascript
document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('formBuilder');
  const formBuilder = new FormBuilder({
    container: container
  });
});
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------------|-------------|
| `container` | HTMLElement | `null` | Container element for FormBuilder (required) |
| `inputHidden` | String | `'jsonForm'` | ID of the hidden input that will contain the form data in JSON |
| `previewOnly` | Boolean | `false` | If `true`, shows only the preview without the editing interface |
| `allowedFields` | Array | `['type', 'fieldId', 'label', 'placeholder', 'options', 'help']` | List of fields allowed in the interface |
| `showFieldControls` | Boolean | `true` | Shows editing controls on the fields (edit, move, delete) |
| `initialData` | Array | `[]` | Initial form data in JSON format |
| `initialValues` | Array | `[]` | Initial values for the form fields |
| `onChange` | Function | `null` | Callback function that runs when the form changes |
| `enableRealTime` | Boolean | `true` | Enables real-time preview |
| `realtimeLayout` | String | `'column'` | Layout of the real-time preview (`'column'` or any other value for row) |
| `previewMode` | String | `'modal'` | Preview mode (`'modal'` or any other value for embedded) |
| `previewTitle` | String | `null` | Custom title for the preview |
| `lang` | String | `'en'` | FormBuilder language |
| `addHidden` | Boolean | `true` | Adds a hidden field with the form's JSON |

## Methods

### Main Methods

| Method | Description |
|--------|-------------|
| `getFormData()` | Returns the form data as a JSON object |
| `setFormData(data)` | Sets the form data from a JSON object |
| `generateFormHTML()` | Generates and returns the HTML of the form |
| `exportFormJSON()` | Exports the form data as a JSON string |
| `importFormJSON(jsonString)` | Imports form data from a JSON string |
| `setLanguage(lang)` | Changes the interface language |
| `copyFormHTMLToClipboard()` | Copies the form HTML to clipboard |
| `copyFormJSONToClipboard()` | Copies the form JSON to clipboard |

## Examples

### Basic Example

```html
<div id="formBuilder"></div>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('formBuilder');
    const formBuilder = new FormBuilder({
      container: container
    });
  });
</script>
```

### With Initial Data

```javascript
const initialData = [
  {
    id: "fullname",
    name: "fullname",
    label: "Full Name",
    type: "text",
    placeholder: "Enter your full name",
    help: "Please write your first and last name"
  },
  {
    id: "email",
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "example@domain.com",
    help: "We will never share your email with third parties"
  }
];

const formBuilder = new FormBuilder({
  container: document.getElementById('formBuilder'),
  initialData: initialData
});
```

### Preview-Only Mode

```javascript
const formBuilder = new FormBuilder({
  container: document.getElementById('formPreview'),
  previewOnly: true,
  initialData: formData
});
```

### Listen for Changes

```javascript
const formBuilder = new FormBuilder({
  container: document.getElementById('formBuilder'),
  onChange: function(data) {
    console.log('The form has changed:', data);
    // Do something with the updated data
  }
});
```

### Change Language

```javascript
// Initialize with a specific language
const formBuilder = new FormBuilder({
  container: document.getElementById('formBuilder'),
  lang: 'es'
});

// Change the language after initialization
formBuilder.setLanguage('fr');
```

## JSON Structure

FormBuilder uses the following JSON format to represent fields:

```json
[
  {
    "id": "fullname",
    "name": "fullname",
    "label": "Full Name",
    "type": "text",
    "placeholder": "Enter your full name",
    "help": "Please write your first and last name"
  },
  {
    "id": "country",
    "name": "country",
    "label": "Country",
    "type": "select",
    "options": ["Spain", "Mexico", "Argentina", "Colombia", "Chile"]
  }
]
```

## Integration with Backend Systems

### PHP

```php
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $formData = json_decode($_POST['jsonForm'], true);
    // Process the data
    print_r($formData);
}
?>

<form method="post">
    <div id="formBuilder"></div>
    <button type="submit" class="btn btn-primary">Submit</button>
</form>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const formBuilder = new FormBuilder({
        container: document.getElementById('formBuilder')
    });
});
</script>
```

## Style Customization

FormBuilder.js is designed to work with Bootstrap 5. To customize the appearance, you can override Bootstrap's CSS classes or add your own styles:

```css
/* Customize the appearance of fields */
.field-wrapper .form-control {
    border-radius: 0;
    border-color: #ddd;
}

/* Customize field controls */
.field-controls span {
    color: #666;
}

.field-controls span:hover {
    color: #007bff;
}
```

## Compatible Browsers

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
