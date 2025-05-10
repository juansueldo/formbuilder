# FormBuilder

FormBuilder is a lightweight JavaScript library for creating dynamic form builders with an intuitive visual interface. It allows users to create, edit, and preview forms without writing HTML code.



## Features

- 🎨 **Drag and drop interface**: Create forms intuitively
- 👁️ **Real-time preview**: See changes as you edit
- 📱 **Responsive**: Works on mobile and desktop devices
- 🔄 **Import/Export**: Save and load forms as JSON
- 🌐 **Multilingual**: Support for different languages (currently Spanish)
- 🎯 **Customizable**: Multiple configuration options

## Supported Field Types

- 📝 Simple text (text)
- 🔢 Number (number)
- ✉️ Email (email)
- 📅 Date (date)
- ✅ Checkbox
- ⚪ Radio buttons
- 📋 Select / Dropdown
- 📄 Text area (textarea)

## Installation

### Prerequisites

- Bootstrap 5 (for styles)

### Basic Usage

1. Include the necessary files in your HTML:

```html
<!-- Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- FormBuilder JavaScript -->
<script src="path/to/formbuilder.js"></script>
```

2. Create a container for FormBuilder:

```html
<div id="formBuilder"></div>
```

3. Initialize FormBuilder:

```javascript
const container = document.getElementById('formBuilder');
const formBuilder = new FormBuilder({
  container: container,
  lang: 'en'
});
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------------|-------------|
| `container` | HTMLElement | `null` | Container element where FormBuilder will be rendered |
| `inputHidden` | String | `'jsonForm'` | ID of the hidden input that will store the form JSON |
| `previewOnly` | Boolean | `false` | If `true`, only shows the preview without editor |
| `allowedFields` | Array | `['type', 'fieldId', 'label', 'placeholder', 'options', 'help']` | Fields allowed in the editor |
| `showFieldControls` | Boolean | `true` | Shows edit/delete controls on fields |
| `initialData` | Array | `[]` | Initial form data in JSON format |
| `onChange` | Function | `null` | Callback function that runs when the form changes |
| `enableRealTime` | Boolean | `true` | Activates real-time preview |
| `realtimeLayout` | String | `'column'` | Preview layout ('column' or as specified) |
| `previewMode` | String | `'modal'` | Preview mode ('modal' or 'inline') |
| `lang` | String | `'en'` | Interface language ('es' available) |

## Public Methods

### `getFormData()`

Returns the form data as an array of objects.

```javascript
const formData = formBuilder.getFormData();
console.log(formData);
```

### `setFormData(data)`

Sets the form data from an array.

```javascript
const data = [
  {
    "id": "name",
    "name": "name",
    "label": "Full Name",
    "type": "text",
    "placeholder": "Enter your name",
    "help": "Please enter your full name"
  }
];

formBuilder.setFormData(data);
```

### `generateFormHTML()`

Generates the form HTML based on current data.

```javascript
const html = formBuilder.generateFormHTML();
document.getElementById('myForm').innerHTML = html;
```

### `exportFormJSON()`

Exports the form as JSON.

```javascript
const json = formBuilder.exportFormJSON();
localStorage.setItem('myForm', json);
```

### `importFormJSON(jsonString)`

Imports a form from JSON.

```javascript
const json = localStorage.getItem('myForm');
formBuilder.importFormJSON(json);
```

### `setLanguage(lang)`

Changes the interface language.

```javascript
formBuilder.setLanguage('en');
```

## Data Structure

Each form field is represented as an object with the following structure:

```javascript
{
  "id": "unique_field",      // Unique field ID
  "name": "unique_field",    // Field name (usually same as ID)
  "label": "Label",          // Label text
  "type": "text",            // Field type
  "placeholder": "Placeholder", // Placeholder text (optional)
  "help": "Help text",       // Help text (optional)
  "options": []              // Options for select/radio/checkbox
}
```

## Complete Usage Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FormBuilder Demo</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <div class="container py-5">
    <h1 class="mb-4">Form Builder</h1>
    
    <div id="formBuilder"></div>
    
    <div class="mt-4">
      <button id="saveBtn" class="btn btn-success">Save Form</button>
      <button id="loadBtn" class="btn btn-primary">Load Form</button>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="path/to/formbuilder.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const container = document.getElementById('formBuilder');
      const formBuilder = new FormBuilder({
        container: container,
        lang: 'en',
        onChange: function(data) {
          console.log('Form updated:', data);
        }
      });
      
      // Button to save the form
      document.getElementById('saveBtn').addEventListener('click', function() {
        const json = formBuilder.exportFormJSON();
        localStorage.setItem('savedForm', json);
        alert('Form saved successfully');
      });
      
      // Button to load a saved form
      document.getElementById('loadBtn').addEventListener('click', function() {
        const json = localStorage.getItem('savedForm');
        if (json) {
          formBuilder.importFormJSON(json);
          alert('Form loaded successfully');
        } else {
          alert('No saved form found');
        }
      });
    });
  </script>
</body>
</html>
```

## CSS Customization

FormBuilder uses Bootstrap 5 for basic styles, but you can customize it according to your needs. Some CSS classes you can override:

```css
/* Customization example */
.tag-list {
  /* Styles for tag list */
}

.tag {
  /* Styles for individual tags */
}

.jsonOutput {
  /* Styles for JSON output */
}
```

## Browser Compatibility

- Chrome (latest version)
- Firefox (latest version)
- Safari (latest version)
- Edge (latest version)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
