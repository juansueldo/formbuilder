
class FormBuilder {
  constructor(options = {}) {
    // Opciones por defecto
    this.options = {
      container: null,
      inputHidden: 'jsonForm',
      previewOnly: false,
      allowedFields: ['type', 'fieldId', 'label', 'placeholder', 'options', 'help'],
      showFieldControls: true,
      initialData: [],
      onChange: null,
      enableRealTime: true,
      lang: 'es',
      ...options
    };

    // Validar el contenedor
    if (!this.options.container || !(this.options.container instanceof HTMLElement)) {
      throw new Error('Se requiere un contenedor HTML válido para FormBuilder');
    }

    // Estado interno
    this.fieldData = [...this.options.initialData];
    this.optionList = [];
    this.editingId = null;
    
    // Inicializar
    this.initTranslations();
    this.render();
    this.initEvents();
  }

  initTranslations(){
    this.translations = {
      'es':{
        'fieldType': 'Tipo de campo:',
        'fieldId': 'ID del campo (único):',
        'fieldLabel': 'Etiqueta (label):',
        'fieldPlaceholder': 'Placeholder:',
        'fieldOptions': 'Opciones:',
        'fieldHelp': 'Texto de ayuda:',
        'optionInputPlaceholder': 'Escribe una opción y presiona Enter',
        'addFieldButton': 'Agregar campo',
        'realtimePreviewTitle': 'Vista previa en tiempo real',
        'formPreviewTitle': 'Vista previa del formulario',
        'selectDefault': 'Seleccionar...',
        'previewNote': 'Vista previa: Este campo será añadido al formulario cuando presiones "Agregar campo"',
        'fieldIdRequired': 'El ID del campo es requerido',
        
        // Tipos de campo
        'text': 'Texto',
        'number': 'Número',
        'email': 'Email',
        'date': 'Fecha',
        'checkbox': 'Checkbox',
        'radio': 'Radio',
        'select': 'Select',
        'textarea': 'Caja de texto',
        
        // Controles de campo
        'edit': 'Editar',
        'moveUp': 'Subir',
        'moveDown': 'Bajar',
        'delete': 'Eliminar',
        
        // Mensajes
        'noOptionsMsg': 'No hay opciones definidas',
        'errorContainer': 'Se requiere un contenedor HTML válido para FormBuilder',
        'errorIdRequired': 'Por favor, ingresa un ID para el campo.',
        'errorOptionsRequired': 'Por favor, agrega al menos una opción para este tipo de campo.',
        'errorIdDuplicate': 'El ID ya está en uso. Por favor, elige uno único.',
        'errorFormDataArray': 'Los datos del formulario deben ser un array',
        'errorImportForm': 'Error al importar el formulario:',
        'errorLabelRequired': 'Error el label es requerido'
      },
      'en': {
        // Builder interface
        'fieldType': 'Field type:',
        'fieldId': 'Field ID (unique):',
        'fieldLabel': 'Label:',
        'fieldPlaceholder': 'Placeholder:',
        'fieldOptions': 'Options:',
        'fieldHelp': 'Help text:',
        'optionInputPlaceholder': 'Type an option and press Enter',
        'addFieldButton': 'Add field',
        'realtimePreviewTitle': 'Real-time preview',
        'formPreviewTitle': 'Form preview',
        'selectDefault': 'Select...',
        'previewNote': 'Preview: This field will be added to the form when you press "Add Field"',
        'fieldIdRequired': 'The field ID is required',
        
        // Field types
        'text': 'Text',
        'number': 'Number',
        'email': 'Email',
        'date': 'Date',
        'checkbox': 'Checkbox',
        'radio': 'Radio',
        'select': 'Select',
        'textarea': 'Textarea',
        
        // Field controls
        'edit': 'Edit',
        'moveUp': 'Move up',
        'moveDown': 'Move down',
        'delete': 'Delete',
        
        // Messages
        'noOptionsMsg': 'No options defined',
        'errorContainer': 'A valid HTML container is required for FormBuilder',
        'errorIdRequired': 'Please enter an ID for the field.',
        'errorOptionsRequired': 'Please add at least one option for this field type.',
        'errorIdDuplicate': 'This ID is already in use. Please choose a unique one.',
        'errorFormDataArray': 'Form data must be an array',
        'errorImportForm': 'Error importing form:',
        'errorLabelRequired': 'Error the label is required'
      },
      // Francés
      'fr': {
        // Interface du constructeur
        'fieldType': 'Type de champ:',
        'fieldId': 'ID du champ (unique):',
        'fieldLabel': 'Étiquette:',
        'fieldPlaceholder': 'Placeholder:',
        'fieldOptions': 'Options:',
        'fieldHelp': 'Texte d\'aide:',
        'optionInputPlaceholder': 'Tapez une option et appuyez sur Entrée',
        'addFieldButton': 'Ajouter un champ',
        'realtimePreviewTitle': 'Aperçu en temps réel',
        'formPreviewTitle': 'Aperçu du formulaire',
        'selectDefault': 'Sélectionner...',
        'previewNote': 'Aperçu: Ce champ sera ajouté au formulaire lorsque vous appuierez sur "Ajouter un champ"',
        'fieldIdRequired': 'L\'ID du champ est requis',
        
        // Types de champs
        'text': 'Texte',
        'number': 'Nombre',
        'email': 'Email',
        'date': 'Date',
        'checkbox': 'Case à cocher',
        'radio': 'Bouton radio',
        'select': 'Liste déroulante',
        'textarea': 'Zone de texte',
        
        // Contrôles de champ
        'edit': 'Modifier',
        'moveUp': 'Monter',
        'moveDown': 'Descendre',
        'delete': 'Supprimer',
        
        // Messages
        'noOptionsMsg': 'Aucune option définie',
        'errorContainer': 'Un conteneur HTML valide est requis pour FormBuilder',
        'errorIdRequired': 'Veuillez saisir un ID pour ce champ.',
        'errorOptionsRequired': 'Veuillez ajouter au moins une option pour ce type de champ.',
        'errorIdDuplicate': 'Cet ID est déjà utilisé. Veuillez en choisir un unique.',
        'errorFormDataArray': 'Les données du formulaire doivent être un tableau',
        'errorImportForm': 'Erreur lors de l\'importation du formulaire:',
        'errorLabelRequired': 'Erreur le libellé est requis'
      },
      // Alemán
      'de': {
        // Builder-Schnittstelle
        'fieldType': 'Feldtyp:',
        'fieldId': 'Feld-ID (eindeutig):',
        'fieldLabel': 'Beschriftung:',
        'fieldPlaceholder': 'Platzhalter:',
        'fieldOptions': 'Optionen:',
        'fieldHelp': 'Hilfetext:',
        'optionInputPlaceholder': 'Option eingeben und Enter drücken',
        'addFieldButton': 'Feld hinzufügen',
        'realtimePreviewTitle': 'Echtzeit-Vorschau',
        'formPreviewTitle': 'Formularvorschau',
        'selectDefault': 'Auswählen...',
        'previewNote': 'Vorschau: Dieses Feld wird zum Formular hinzugefügt, wenn Sie auf "Feld hinzufügen" klicken',
        'fieldIdRequired': 'Die Feld-ID ist erforderlich',
        
        // Feldtypen
        'text': 'Text',
        'number': 'Zahl',
        'email': 'E-Mail',
        'date': 'Datum',
        'checkbox': 'Kontrollkästchen',
        'radio': 'Radiobutton',
        'select': 'Dropdown',
        'textarea': 'Textbereich',
        
        // Feldsteuerelemente
        'edit': 'Bearbeiten',
        'moveUp': 'Nach oben',
        'moveDown': 'Nach unten',
        'delete': 'Löschen',
        
        // Nachrichten
        'noOptionsMsg': 'Keine Optionen definiert',
        'errorContainer': 'Ein gültiger HTML-Container ist für FormBuilder erforderlich',
        'errorIdRequired': 'Bitte geben Sie eine ID für das Feld ein.',
        'errorOptionsRequired': 'Bitte fügen Sie mindestens eine Option für diesen Feldtyp hinzu.',
        'errorIdDuplicate': 'Diese ID wird bereits verwendet. Bitte wählen Sie eine eindeutige ID.',
        'errorFormDataArray': 'Formulardaten müssen ein Array sein',
        'errorImportForm': 'Fehler beim Importieren des Formulars:',
        'errorLabelRequired': 'Fehler Die Bezeichnung ist erforderlich'
      }
    }
  }
  translate(key) {
    const lang = this.options.lang;
    // Si el idioma existe y la clave existe en ese idioma
    if (this.translations[lang] && this.translations[lang][key]) {
      return this.translations[lang][key];
    }
    // Si no, intentar con el idioma por defecto (español)
    else if (this.translations['es'] && this.translations['es'][key]) {
      return this.translations['es'][key];
    }
    // Si todo falla, devolver la clave
    return key;
  }

  /**
  * Cambia el idioma del formulario
  */
  setLanguage(lang) {
    if (this.translations[lang]) {
      this.options.lang = lang;
      // Volver a renderizar la interfaz
      this.render();
      return true;
    }
    return false;
  }
  /**
   * Renderiza la interfaz principal
   */
  render() {
    const container = this.options.container;
    container.innerHTML = '';
    container.classList.add('form-builder');

    if (!this.options.previewOnly) {
      this.renderBuilderInterface(container);
    }

    // Siempre mostrar la vista previa
    this.renderPreviewInterface(container);

    // Inicializar campos desde los datos iniciales
    this.fieldData.forEach(field => {
      this.renderFieldToFormPreview(field);
    });
  }

  /**
   * Renderiza la interfaz del constructor de formularios
   */
  renderBuilderInterface(container) {
    const builderCol = document.createElement('div');
    
    builderCol.className = this.options.enableRealTime ? 'col-6 form-final' : 'col-12 form-final';
    
    // Definir todos los campos posibles
    const fieldDefinitions = {
      type: {
        label: this.translate('fieldType'),
        render: () => {
          const field = document.createElement('div');
          field.className = 'field';
          
          const label = document.createElement('label');
          label.setAttribute('for', 'type');
          label.textContent = this.translate('fieldType');
          
          const select = document.createElement('select');
          select.id = 'type';
          select.className = 'form-control';
          
          const options = [
            { value: 'text', text: this.translate('text') },
            { value: 'number', text: this.translate('number') },
            { value: 'email', text: this.translate('email') },
            { value: 'date', text: this.translate('dete') },
            { value: 'checkbox', text: this.translate('checkbox') },
            { value: 'radio', text: this.translate('radio') },
            { value: 'select', text: this.translate('select') },
            { value: 'textarea', text: this.translate('textarea') }
          ];
          
          options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.text;
            select.appendChild(option);
          });
          
          field.appendChild(label);
          field.appendChild(select);
          
          this.typeField = select;
          return field;
        }
      },
      fieldId: {
        label: this.translate('fieldId'),
        render: () => {
          const field = document.createElement('div');
          field.className = 'field';
          
          const label = document.createElement('label');
          label.setAttribute('for', 'fieldId');
          label.textContent =  this.translate('fieldId');
          
          const input = document.createElement('input');
          input.className = 'form-control';
          input.type = 'text';
          input.id = 'fieldId';
          
          field.appendChild(label);
          field.appendChild(input);
          
          this.fieldIdField = input;
          return field;
        }
      },
      label: {
        label: this.translate('fieldLabel'),
        render: () => {
          const field = document.createElement('div');
          field.className = 'field';
          
          const label = document.createElement('label');
          label.setAttribute('for', 'label');
          label.textContent = this.translate('fieldLabel');
          
          const input = document.createElement('input');
          input.className = 'form-control';
          input.type = 'text';
          input.id = 'label';
          
          field.appendChild(label);
          field.appendChild(input);
          
          this.labelField = input;
          return field;
        }
      },
      placeholder: {
        label: this.translate('fieldPlaceholder'),
        render: () => {
          const field = document.createElement('div');
          field.className = 'field';
          field.id = 'placeholderFields';
          
          const label = document.createElement('label');
          label.setAttribute('for', 'placeholder');
          label.textContent = this.translate('fieldPlaceholder');
          
          const input = document.createElement('input');
          input.className = 'form-control';
          input.type = 'text';
          input.id = 'placeholder';
          
          field.appendChild(label);
          field.appendChild(input);
          
          this.placeholderField = input;
          return field;
        }
      },
      options: {
        label: this.translate('fieldOptions'),
        render: () => {
          const field = document.createElement('div');
          field.className = 'field options-container';
          field.id = 'optionsField';
          
          const label = document.createElement('label');
          label.setAttribute('for', 'optionInput');
          label.textContent = this.translate('fieldOptions');
          
          const input = document.createElement('input');
          input.className = 'form-control';
          input.type = 'text';
          input.id = 'optionInput';
          input.placeholder = this.translate('optionInputPlaceholder');
          
          const tagList = document.createElement('div');
          tagList.className = 'tag-list';
          tagList.id = 'optionTags';
          
          field.appendChild(label);
          field.appendChild(input);
          field.appendChild(tagList);
          
          this.optionInput = input;
          this.optionTags = tagList;
          return field;
        }
      },
      help: {
        label: this.translate('fieldHelp'),
        render: () => {
          const field = document.createElement('div');
          field.className = 'field';
          
          const label = document.createElement('label');
          label.setAttribute('for', 'help');
          label.textContent = this.translate('fieldHelp');
          
          const input = document.createElement('input');
          input.className = 'form-control';
          input.type = 'text';
          input.id = 'help';
          
          field.appendChild(label);
          field.appendChild(input);
          
          this.helpField = input;
          return field;
        }
      }
    };
    
    // Renderizar solo los campos permitidos
    this.options.allowedFields.forEach(fieldName => {
      if (fieldDefinitions[fieldName]) {
        builderCol.appendChild(fieldDefinitions[fieldName].render());
      }
    });
    
    // Botón para agregar campos
    const addButton = document.createElement('button');
    addButton.className = 'w-100';
    addButton.textContent = this.translate('addFieldButton');
    addButton.onclick = () => this.addField();
    builderCol.appendChild(addButton);
    container.appendChild(builderCol);
    // Vista previa en tiempo real
    if (this.options.enableRealTime) {
      const realTimeContainer = document.createElement('div');
      realTimeContainer.className = "col-6"
      const previewTitle = document.createElement('h4');
      previewTitle.textContent =  this.translate('realtimePreviewTitle');
      previewTitle.style.marginTop = '20px';
      realTimeContainer.appendChild(previewTitle);
      
      const realTimePreview = document.createElement('div');
      realTimePreview.id = 'realTimePreview';
      realTimePreview.className = 'real-time-preview';
      realTimePreview.style.padding = '10px';
      realTimePreview.style.border = '1px solid #ddd';
      realTimePreview.style.borderRadius = '4px';
      realTimePreview.style.marginTop = '10px';
      this.realTimePreview = realTimePreview;
      realTimeContainer.appendChild(realTimePreview);
      container.appendChild(realTimeContainer);
    }
  }

  /**
   * Renderiza la interfaz de vista previa del formulario
   */
  renderPreviewInterface(container) {
    const previewCol = document.createElement('div');
    previewCol.className = 'col-12';
    
    const previewTitle = document.createElement('h3');
    previewTitle.textContent = this.translate('formPreviewTitle');
    previewCol.appendChild(previewTitle);
    
    const formPreview = document.createElement('div');
    formPreview.id = 'formPreview';
    formPreview.className = 'form-preview';
    this.formPreview = formPreview;
    
    previewCol.appendChild(formPreview);
    
    // Input oculto para almacenar el JSON del formulario
    const jsonFormInput = document.createElement('input');
    jsonFormInput.type = 'hidden';
    jsonFormInput.id = this.options.inputHidden;
    this.jsonFormInput = jsonFormInput;
    
    previewCol.appendChild(jsonFormInput);
    
    // Añadir todo al contenedor
    container.appendChild(previewCol);
  }

  /**
   * Inicializa los eventos de la interfaz
   */
  initEvents() {
    if (this.options.previewOnly) return;
    
    // Evento para cambio de tipo de campo
    this.typeField.addEventListener('change', () => {
      this.optionList = [];
      this.optionTags.innerHTML = '';
      this.updateOptionsVisibility();
    });
    
    // Evento para añadir opciones
    if (this.optionInput) {
    this.optionInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const value = this.optionInput.value.trim();
        if (value && !this.optionList.includes(value)) {
          this.optionList.push(value);
          this.renderOptionTags();
          this.renderRealTimePreview();
        }
        this.optionInput.value = '';
      }
    });
  }
    
    const updateFields = [this.typeField, this.labelField, this.placeholderField, this.helpField, this.fieldIdField];
    
    // Usar un debounce para evitar demasiadas actualizaciones en inputs rápidos
    let debounceTimer;
    const debounce = (callback, time) => {
      window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(callback, time);
    };
    
    updateFields.forEach(field => {
      if (field) {
        // Usar input para actualización inmediata pero con debounce
        field.addEventListener('input', () => {
          if (this.options.enableRealTime) {
            debounce(() => this.renderRealTimePreview(), 100);
          }
        });
        
        // También actualizar en cambio completo
        field.addEventListener('change', () => {
          if (this.options.enableRealTime) {
            this.renderRealTimePreview();
          }
        });
      }
    });
    
    this.updateOptionsVisibility();
  }

  /**
   * Actualiza la visibilidad del campo de opciones
   */
  updateOptionsVisibility() {
    if (this.options.previewOnly) return;
    
    const type = this.typeField.value;
    const optionsField = document.getElementById('optionsField');
    const placeholderFields = document.getElementById('placeholderFields');
    
    if (optionsField) {
      optionsField.style.display = (type === 'select' || type === 'radio' || type === 'checkbox') ? 'block' : 'none';
    }
    
    if (placeholderFields) {
      placeholderFields.style.display = (type === 'select' || type === 'radio' || type === 'checkbox') ? 'none' : 'block';
    }
    
    this.renderRealTimePreview();
  }

  /**
   * Renderiza las etiquetas de las opciones
   */
  renderOptionTags() {
    this.optionTags.innerHTML = '';
    this.optionList.forEach((opt, i) => {
      const tag = document.createElement('div');
      tag.className = 'tag';
      tag.textContent = opt;
      
      const remove = document.createElement('span');
      remove.textContent = '✕';
      remove.onclick = () => {
        this.optionList.splice(i, 1);
        this.renderOptionTags();
        this.renderRealTimePreview();
      };
      
      tag.appendChild(remove);
      this.optionTags.appendChild(tag);
    });
  }

  /**
   * Renderiza la vista previa en tiempo real
   */
  renderRealTimePreview() {
    if (this.options.previewOnly || !this.realTimePreview) return;
    
    const type = this.typeField.value;
    const label = this.labelField.value;
    const placeholder = this.placeholderField ? this.placeholderField.value : '';
    const help = this.helpField ? this.helpField.value : '';
    const id = this.fieldIdField.value;
    const name = this.fieldIdField.value;

    // Mensaje si no hay ID
    if (!id) {
      this.realTimePreview.innerHTML = `<p style="color: #999; font-style: italic;">${this.translate('fieldIdRequired')}</p>`;
      return;
    }
    
    this.realTimePreview.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'field';

    // Añadir etiqueta principal
    if (label) {
      const labelEl = document.createElement('label');
      labelEl.textContent = label;
      if (type !== 'radio' && type !== 'checkbox') {
        labelEl.setAttribute('for', id);
      }
      wrapper.appendChild(labelEl);
    }

    let input;
    if (type === 'textarea') {
      input = document.createElement('textarea');
      input.className = 'form-control';
      input.placeholder = placeholder;
      input.id = id;
      input.name = name;
      wrapper.appendChild(input);
    } else if (type === 'select') {
      input = document.createElement('select');
      input.className = 'form-control';
      input.id = id;
      input.name = name;
      
      // Añadir opción vacía si no hay opciones
      if (this.optionList.length === 0) {
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = this.translate('selectDefault');
        input.appendChild(emptyOption);
      } else {
        this.optionList.forEach(opt => {
          const option = document.createElement('option');
          option.value = opt;
          option.textContent = opt;
          input.appendChild(option);
        });
      }
      wrapper.appendChild(input);
    } else if (type === 'radio' || type === 'checkbox') {
      const optionsContainer = document.createElement('div');
      optionsContainer.className = 'options-container';
      
      // Si no hay opciones, mostrar un mensaje
      if (this.optionList.length === 0) {
        const noOptionsMsg = document.createElement('div');
        noOptionsMsg.textContent = this.translate('noOptionsMsg');
        noOptionsMsg.style.fontStyle = 'italic';
        noOptionsMsg.style.color = '#777';
        optionsContainer.appendChild(noOptionsMsg);
      } else {
        this.optionList.forEach(opt => {
          const optWrapper = document.createElement('div');
          optWrapper.className = 'option-item';
          
          const optInput = document.createElement('input');
          optInput.type = type;
          optInput.name = type === 'radio' ? name : `${name}_${opt}`;
          optInput.value = opt;
          optInput.id = `${id}_${opt}`;
          
          const optLabel = document.createElement('label');
          optLabel.textContent = opt;
          optLabel.setAttribute('for', optInput.id);

          optWrapper.appendChild(optInput);
          optWrapper.appendChild(optLabel);
          optionsContainer.appendChild(optWrapper);
        });
      }
      
      wrapper.appendChild(optionsContainer);
    } else {
      input = document.createElement('input');
      input.className = 'form-control';
      input.type = type;
      input.placeholder = placeholder;
      input.id = id;
      input.name = name;
      wrapper.appendChild(input);
    }

    if (help) {
      const helpEl = document.createElement('div');
      helpEl.className = 'help-text';
      helpEl.textContent = help;
      wrapper.appendChild(helpEl);
    }

    this.realTimePreview.appendChild(wrapper);
    
    // Añadir mensaje adicional para mejor UX
    const previewNote = document.createElement('div');
    previewNote.style.marginTop = '10px';
    previewNote.style.fontSize = '0.8rem';
    previewNote.style.color = '#666';
    previewNote.textContent = this.translate('previewNote');
    this.realTimePreview.appendChild(previewNote);
  }

  /**
   * Crear un elemento SVG para los controles
   */
  svgCreate(paths) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
        
    paths.forEach(d => {
      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', d);
      svg.appendChild(path);
    });
    
    return svg;
  }

  /**
   * Crea un elemento de campo para la vista previa
   */
  createFieldElement(field) {
    const wrapper = document.createElement('div');
    wrapper.className = 'field';
    
    if (field.label) {
      const labelEl = document.createElement('label');
      labelEl.textContent = field.label;
      if (field.type !== 'radio' && field.type !== 'checkbox') {
        labelEl.setAttribute('for', field.id);
      }
      wrapper.appendChild(labelEl);
    }
    
    let input;
    if (field.type === 'textarea') {
      input = document.createElement('textarea');
      input.className = 'form-control';
      input.placeholder = field.placeholder || '';
      input.id = field.id;
      input.name = field.name;
      wrapper.appendChild(input);
    } else if (field.type === 'select') {
      input = document.createElement('select');
      input.className = 'form-control';
      input.id = field.id;
      input.name = field.name;
      
      if (!field.options || field.options.length === 0) {
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = this.translate('selectDefault');
        input.appendChild(emptyOption);
      } else {
        field.options.forEach(opt => {
          const option = document.createElement('option');
          option.value = opt;
          option.textContent = opt;
          input.appendChild(option);
        });
      }
      wrapper.appendChild(input);
    } else if (field.type === 'radio' || field.type === 'checkbox') {
      const optionsContainer = document.createElement('div');
      optionsContainer.className = 'options-container';
      
      if (!field.options || field.options.length === 0) {
        const noOptionsMsg = document.createElement('div');
        noOptionsMsg.textContent = this.translate('noOptionsMsg');
        noOptionsMsg.style.fontStyle = 'italic';
        noOptionsMsg.style.color = '#777';
        optionsContainer.appendChild(noOptionsMsg);
      } else {
        field.options.forEach(opt => {
          const optWrapper = document.createElement('div');
          optWrapper.className = 'option-item';
          
          const optInput = document.createElement('input');
          optInput.type = field.type;
          optInput.name = field.type === 'radio' ? field.name : `${field.name}_${opt}`;
          optInput.value = opt;
          optInput.id = `${field.id}_${opt}`;
          
          const optLabel = document.createElement('label');
          optLabel.textContent = opt;
          optLabel.setAttribute('for', optInput.id);

          optWrapper.appendChild(optInput);
          optWrapper.appendChild(optLabel);
          optionsContainer.appendChild(optWrapper);
        });
      }
      
      wrapper.appendChild(optionsContainer);
    } else {
      input = document.createElement('input');
      input.className = 'form-control';
      input.type = field.type;
      input.placeholder = field.placeholder || '';
      input.id = field.id;
      input.name = field.name;
      wrapper.appendChild(input);
    }

    if (field.help) {
      const helpEl = document.createElement('div');
      helpEl.className = 'help-text';
      helpEl.textContent = field.help;
      wrapper.appendChild(helpEl);
    }
    
    return wrapper;
  }

  /**
   * Renderiza un campo en la vista previa del formulario
   */
  renderFieldToFormPreview(field) {
    const fieldElement = this.createFieldElement(field);
    
    const wrapper = document.createElement('div');
    wrapper.className = 'field-wrapper';
    wrapper.dataset.fieldId = field.id;
    wrapper.style.position = 'relative';
    wrapper.style.marginBottom = '15px';
    wrapper.appendChild(fieldElement);

    // Añadir controles si están habilitados
    if (this.options.showFieldControls && !this.options.previewOnly) {
      const controls = document.createElement('div');
      controls.className = 'field-controls';
      controls.style.position = 'absolute';
      controls.style.top = '5px';
      controls.style.right = '5px';
      controls.style.background = 'rgba(255, 255, 255, 0.8)';
      controls.style.padding = '3px';
      controls.style.borderRadius = '3px';

      const btnEdit = document.createElement('button');
      btnEdit.appendChild(this.svgCreate(['M12 20h9', 'M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5']));
      btnEdit.title = 'Editar';
      btnEdit.onclick = () => {
        this.enterEditMode(field.id);
      };

      const btnUp = document.createElement('button');
      btnUp.appendChild(this.svgCreate(['M12 5l0 14','M16 9l-4 -4','M8 9l4 -4']));
      btnUp.title = 'Subir';
      btnUp.onclick = () => {
        if (wrapper.previousElementSibling) {
          this.formPreview.insertBefore(wrapper, wrapper.previousElementSibling);
          this.reorderFieldData();
          this.updateJSONView();
        }
      };

      const btnDown = document.createElement('button');
      btnDown.appendChild(this.svgCreate(['M12 5l0 14','M16 15l-4 4','M8 15l4 4']));
      btnDown.title = 'Bajar';
      btnDown.onclick = () => {
        if (wrapper.nextElementSibling) {
          this.formPreview.insertBefore(wrapper.nextElementSibling, wrapper);
          this.reorderFieldData();
          this.updateJSONView();
        }
      };

      const btnDelete = document.createElement('button');
      btnDelete.appendChild(this.svgCreate(['M4 7l16 0','M10 11l0 6','M14 11l0 6','M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12','M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3']));
      btnDelete.title = 'Eliminar';
      btnDelete.onclick = () => {
        const index = this.fieldData.findIndex(f => f.id === field.id);
        if (index !== -1) this.fieldData.splice(index, 1);
        wrapper.remove();
        this.updateJSONView();
      };

      [btnEdit, btnUp, btnDown, btnDelete].forEach(btn => {
        btn.style.marginLeft = '5px';
        btn.style.cursor = 'pointer';
        btn.style.padding = '2px 6px';
        controls.appendChild(btn);
      });

      wrapper.appendChild(controls);
    }
    
    this.formPreview.appendChild(wrapper);
  }

  /**
   * Añade un nuevo campo al formulario
   */
  addField() {
    const type = this.typeField.value;
    const label = this.labelField.value.trim();
    const id = this.fieldIdField.value.trim().toLowerCase();
    const placeholder = this.placeholderField ? this.placeholderField.value.trim() : '';
    const help = this.helpField ? this.helpField.value.trim() : '';
    const name = this.fieldIdField.value.trim().toLowerCase();

    if (!id) {
      alert(this.translate('errorIdRequired'));
      return;
    }

    if(!label){
      alert(this.translate('errorLabelRequired'));
    }

    // Verificar que existan opciones para los tipos que las requieren
    if ((type === 'select' || type === 'radio' || type === 'checkbox') && this.optionList.length === 0) {
      alert(this.translate('errorOptionsRequired'));
      return;
    }

    // Solo verificar duplicados cuando no estamos en modo edición
    if (this.editingId === null && this.fieldData.some(f => f.id === id)) {
      alert(this.translate('errorIdDuplicate'));
      return;
    } else if (this.editingId !== null && this.editingId !== id && this.fieldData.some(f => f.id === id)) {
      alert(this.translate('errorIdDuplicate'));
      return;
    }

    // Si estamos en modo edición, eliminar el campo anterior
    if (this.editingId !== null) {
      const oldWrapper = this.formPreview.querySelector(`[data-field-id="${this.editingId}"]`);
      if (oldWrapper) {
        oldWrapper.remove();
      }
    }

    const newField = {
      id,
      name,
      label,
      type,
      placeholder,
      help,
      options: ['select', 'radio', 'checkbox'].includes(type) ? [...this.optionList] : []
    };

    // Actualizar o añadir al array de datos
    if (this.editingId !== null) {
      const index = this.fieldData.findIndex(f => f.id === this.editingId);
      if (index !== -1) {
        this.fieldData[index] = newField;
      }
    } else {
      // Añadir nuevo campo
      this.fieldData.push(newField);
    }

    // Renderizar el campo al formulario de vista previa
    this.renderFieldToFormPreview(newField);
    
    this.updateJSONView();

    // Reset
    if (!this.options.previewOnly) {
      this.labelField.value = '';
      this.fieldIdField.value = '';
      if (this.placeholderField) this.placeholderField.value = '';
      if (this.helpField) this.helpField.value = '';
      if (this.optionInput) this.optionInput.value = '';
      this.optionList = [];
      if (this.optionTags) this.optionTags.innerHTML = '';
      this.editingId = null;
      this.renderRealTimePreview();
    }
    
    // Llamar al callback si existe
    if (typeof this.options.onChange === 'function') {
      this.options.onChange(this.fieldData);
    }
  }

  /**
   * Actualiza la vista JSON del formulario
   */
  updateJSONView() {
    // Actualizar el input oculto con los datos actuales
    if (this.jsonFormInput) {
      this.jsonFormInput.value = JSON.stringify(this.fieldData, null, 2);
    }
    
    // Llamar al callback si existe
    if (typeof this.options.onChange === 'function') {
      this.options.onChange(this.fieldData);
    }

    // Generar vista JSON en la interfaz si está configurada
    if (this.options.showJsonView) {
      let jsonOutput = document.getElementById("jsonOutput");
      if (!jsonOutput) {
        jsonOutput = document.createElement("pre");
        jsonOutput.id = "jsonOutput";
        jsonOutput.className = "jsonOutput";
        this.options.container.appendChild(jsonOutput);
      }
      jsonOutput.innerHTML = this.syntaxHighlight(this.fieldData);
    }
  }

  /**
   * Destaca la sintaxis JSON para mostrarla coloreada
   */
  syntaxHighlight(json) {
    if (typeof json != 'string') {
      json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|\b\d+\.?\d*\b)/g, match => {
      let cls = 'number';
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? 'key' : 'string';
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return `<span class="${cls}">${match}</span>`;
    });
  }

  /**
   * Reordena los datos de los campos según su orden en el DOM
   */
  reorderFieldData() {
    // Obtener los IDs en orden según aparecen en el DOM
    const wrapperOrder = Array.from(this.formPreview.children).map(wrapper => wrapper.dataset.fieldId);
    
    // Ordenar el array fieldData según el orden de los wrappers
    this.fieldData.sort((a, b) => {
      const indexA = wrapperOrder.indexOf(a.id);
      const indexB = wrapperOrder.indexOf(b.id);
      
      // Si ambos elementos existen en el DOM, ordenar por su posición
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      
      // Si solo uno de los elementos existe en el DOM, ponerlo primero
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      // Si ninguno existe en el DOM, mantener el orden original
      return 0;
    });
  }

  /**
   * Entra en modo de edición para un campo específico
   */
  enterEditMode(id) {
    if (this.options.previewOnly) return;
    
    const field = this.fieldData.find(f => f.id === id);
    if (!field) return;

    this.editingId = id;
    
    // Actualizar campos del formulario
    this.typeField.value = field.type;
    this.labelField.value = field.label;
    this.fieldIdField.value = field.id;
    if (this.placeholderField) this.placeholderField.value = field.placeholder || '';
    if (this.helpField) this.helpField.value = field.help || '';
    
    // Actualizar opciones si existen
    this.optionList = field.options ? [...field.options] : [];
    this.renderOptionTags();
    
    // Actualizar la vista previa con los nuevos datos
    this.updateOptionsVisibility();
    
    // Opcional: desplazar la vista hasta el formulario de edición
    this.typeField.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /**
   * Obtiene los datos del formulario como JSON
   */
  getFormData() {
    return this.fieldData;
  }

  /**
   * Establece los datos del formulario desde un objeto JSON
   */
  setFormData(data) {
    if (!Array.isArray(data)) {
      throw new Error(this.translate('errorFormDataArray'));
    }
    
    this.fieldData = [...data];
    
    // Limpiar la vista previa
    this.formPreview.innerHTML = '';
    
    // Renderizar todos los campos
    this.fieldData.forEach(field => {
      this.renderFieldToFormPreview(field);
    });
    
    this.updateJSONView();
  }

  /**
   * Genera el HTML del formulario basado en los datos actuales
   * @returns {string} HTML del formulario
   */
  generateFormHTML() {
    const formHTML = document.createElement('form');
    
    this.fieldData.forEach(field => {
      const fieldElement = this.createFieldElement(field);
      formHTML.appendChild(fieldElement);
    });
    
    return formHTML.outerHTML;
  }

  /**
   * Exporta el formulario como JSON
   * @returns {string} JSON del formulario
   */
  exportFormJSON() {
    return JSON.stringify(this.fieldData, null, 2);
  }

  /**
   * Importa un formulario desde JSON
   * @param {string} jsonString - JSON del formulario
   */
  importFormJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      this.setFormData(data);
      return true;
    } catch (error) {
      console.error(this.translate('errorImportForm'), error);
      return false;
    }
  }
}