
class FormBuilder {
  constructor(options = {}) {
    this.options = {
      container: null,
      inputHidden: 'jsonForm',
      previewOnly: false,
      allowedFields: ['type', 'fieldId', 'label', 'placeholder', 'options', 'help'],
      showFieldControls: true,
      initialData: [],
      initialValues: [],
      onChange: null,
      enableRealTime: true,
      realtimeLayout: 'column',
      previewMode: 'modal',
      previewTitle: null,
      lang: 'en',
      addHidden: true,
      displayMode: 'tabs',
      ...options
    };
    this._initTranslations();

    if (!this.options.container || !(this.options.container instanceof HTMLElement)) {
      throw new Error(this.translations('errorHTML'));
    }

    this.fieldData = [...this.options.initialData];
    this.optionList = [];
    this.editingId = null;
    
    this._initStyles();
    this.render();
    this.initEvents();
  }

  _initStyles(){
    const styles = document.createElement('style');
    styles.textContent = `
      .tag-list {
          display: flex;
          flex-wrap: wrap;
          margin-top: 8px;
      }

      .tag {
          background-color: var(--bs-primary);
          color: var(--fc-button-text-color);
          border-radius: 3px;
          padding: 3px 8px;
          margin-right: 5px;
          margin-bottom: 5px;
          font-size: 13px;
          display: flex;
          align-items: center;
      }

      .tag span {
          margin-left: 5px;
          cursor: pointer;
          font-weight: bold;
          color: var(--fc-button-text-color);
      }

      .jsonOutput {
        margin-top: 20px;
        padding: 15px;
        background-color: #f5f5f5;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-family: monospace;
        font-size: 13px;
        overflow: auto;
        max-height: 300px;
        width: 100%;
      }
  
      .jsonOutput .key {
        color: #a71d5d;
      }
  
      .jsonOutput .string {
        color: #183691;
      }
  
      .jsonOutput .number {
        color: #0086b3;
      }
  
      .jsonOutput .boolean {
        color: #0086b3;
      }
  
      .jsonOutput .null {
        color: #a71d5d;
      }
      
      `;
    document.head.appendChild(styles);
  }

  _initTranslations(){
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
        'fieldLabelRequired': 'El Label del campo es requerido',
        'text': 'Texto',
        'number': 'Número',
        'email': 'Email',
        'date': 'Fecha',
        'checkbox': 'Checkbox',
        'radio': 'Radio',
        'select': 'Select',
        'textarea': 'Caja de texto',
        'edit': 'Editar',
        'moveUp': 'Subir',
        'moveDown': 'Bajar',
        'delete': 'Eliminar',
        'noOptionsMsg': 'No hay opciones definidas',
        'errorContainer': 'Se requiere un contenedor HTML válido para FormBuilder',
        'errorIdRequired': 'Por favor, ingresa un ID para el campo.',
        'errorOptionsRequired': 'Por favor, agrega al menos una opción para este tipo de campo.',
        'errorIdDuplicate': 'El ID ya está en uso. Por favor, elige uno único.',
        'errorFormDataArray': 'Los datos del formulario deben ser un array',
        'errorImportForm': 'Error al importar el formulario:',
        'errorLabelRequired': 'Error el label es requerido',
        'errorHTML': 'Se requiere un contenedor HTML válido para FormBuilder',
        "errorHTML": "Se requiere un contenedor HTML válido para FormBuilder",
        'noDataMsg': 'No hay datos registrados',
        "fieldMsg": "Campo",
        "addMsg": "agregado",
        "updateMsg": "actualizado",
        "success": "correctamente",
        'copySuccessHTML':'Formulario HTML copiado al portapapeles.',
        'copySuccessJSON':'Formulario JSON copiado al portapapeles.',
        'copyErrorHTML':'Error al copiar HTML',
        'copyErrorJSON':'Error al copiar JSON',
        'initialFieldDeleted': 'El campo',
        'fieldDeleted': 'fue eliminado.'
      },
      'en': {
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
        'fieldLabelRequired': 'The field label is required',
        'text': 'Text',
        'number': 'Number',
        'email': 'Email',
        'date': 'Date',
        'checkbox': 'Checkbox',
        'radio': 'Radio',
        'select': 'Select',
        'textarea': 'Textarea',
        'edit': 'Edit',
        'moveUp': 'Move up',
        'moveDown': 'Move down',
        'delete': 'Delete',
        'noOptionsMsg': 'No options defined',
        'errorContainer': 'A valid HTML container is required for FormBuilder',
        'errorIdRequired': 'Please enter an ID for the field.',
        'errorOptionsRequired': 'Please add at least one option for this field type.',
        'errorIdDuplicate': 'This ID is already in use. Please choose a unique one.',
        'errorFormDataArray': 'Form data must be an array',
        'errorImportForm': 'Error importing form:',
        'errorLabelRequired': 'Error the label is required',
        'errorHTML': 'A valid HTML container is required for FormBuilder',
        "errorHTML": "A valid HTML container is required for FormBuilder",
        'noDataMsg': 'No data recorded',
        "fieldMsg": "Field",
        "addMsg": "added",
        "updateMsg": "updated",
        "success": "successfully",
        'copySuccessHTML': 'HTML form copied to clipboard.',
        'copySuccessJSON': 'Form JSON copied to clipboard.',
        'copyErrorHTML': 'Error copying HTML.',
        'copyErrorJSON': 'Error copying JSON.',
        'initialFieldDeleted': 'Field',
        'fieldDeleted': 'was deleted.'
      },
      'fr': {
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
        'fieldLabelRequired': 'L’étiquette du champ est requise',
        'text': 'Texte',
        'number': 'Nombre',
        'email': 'Email',
        'date': 'Date',
        'checkbox': 'Case à cocher',
        'radio': 'Bouton radio',
        'select': 'Liste déroulante',
        'textarea': 'Zone de texte',
        'edit': 'Modifier',
        'moveUp': 'Monter',
        'moveDown': 'Descendre',
        'delete': 'Supprimer',
        'noOptionsMsg': 'Aucune option définie',
        'errorContainer': 'Un conteneur HTML valide est requis pour FormBuilder',
        'errorIdRequired': 'Veuillez saisir un ID pour ce champ.',
        'errorOptionsRequired': 'Veuillez ajouter au moins une option pour ce type de champ.',
        'errorIdDuplicate': 'Cet ID est déjà utilisé. Veuillez en choisir un unique.',
        'errorFormDataArray': 'Les données du formulaire doivent être un tableau',
        'errorImportForm': 'Erreur lors de l\'importation du formulaire:',
        'errorLabelRequired': 'Erreur le libellé est requis',
        'errorHTML': 'Un conteneur HTML valide est requis pour FormBuilder',
        "errorHTML": "Un conteneur HTML valide est requis pour FormBuilder",
        'noDataMsg': 'Aucune donnée enregistrée',
        "fieldMsg": "Champ",
        "addMsg": "ajouté",
        "updateMsg": "mis à jour",
        "success": "avec succès",
        'copySuccessHTML': 'Formulaire HTML copié dans le presse-papiers.',
        'copySuccessJSON': 'Formulaire JSON copié dans le presse-papiers.',
        'copyErrorHTML': 'Erreur lors de la copie du HTML.',
        'copyErrorJSON': 'Erreur lors de la copie du JSON.',
        'initialFieldDeleted': 'Le champ',
        'fieldDeleted': 'a été supprimé.'
      },
      'pt': {
        'fieldType': 'Tipo de campo:',
        'fieldId': 'ID do campo (único):',
        'fieldLabel': 'Rótulo (label):',
        'fieldPlaceholder': 'Placeholder:',
        'fieldOptions': 'Opções:',
        'fieldHelp': 'Texto de ajuda:',
        'optionInputPlaceholder': 'Digite uma opção e pressione Enter',
        'addFieldButton': 'Adicionar campo',
        'realtimePreviewTitle': 'Pré-visualização em tempo real',
        'formPreviewTitle': 'Pré-visualização do formulário',
        'selectDefault': 'Selecionar...',
        'previewNote': 'Pré-visualização: Este campo será adicionado ao formulário quando você pressionar "Adicionar campo"',
        'fieldIdRequired': 'O ID do campo é obrigatório',
        'fieldLabelRequired': 'O rótulo do campo é obrigatório',
        'text': 'Texto',
        'number': 'Número',
        'email': 'Email',
        'date': 'Data',
        'checkbox': 'Checkbox',
        'radio': 'Radio',
        'select': 'Select',
        'textarea': 'Área de texto',
        'edit': 'Editar',
        'moveUp': 'Subir',
        'moveDown': 'Descer',
        'delete': 'Excluir',
        'noOptionsMsg': 'Nenhuma opção definida',
        'errorContainer': 'É necessário um contêiner HTML válido para o FormBuilder',
        'errorIdRequired': 'Por favor, insira um ID para o campo.',
        'errorOptionsRequired': 'Por favor, adicione pelo menos uma opção para este tipo de campo.',
        'errorIdDuplicate': 'O ID já está em uso. Por favor, escolha um único.',
        'errorFormDataArray': 'Os dados do formulário devem ser um array',
        'errorImportForm': 'Erro ao importar o formulário:',
        'errorLabelRequired': 'Erro: o rótulo é obrigatório',
        'errorHTML': 'É necessário um contêiner HTML válido para o FormBuilder',
        "errorHTML": "É necessário um contêiner HTML válido para o FormBuilder",
        'noDataMsg': 'Nenhum dado registrado',
        "fieldMsg": "Campo",
        "addMsg": "adicionado",
        "updateMsg": "atualizado",
        "success": "com sucesso",
        'copySuccessHTML': 'Formulário HTML copiado para a área de transferência.',
        'copySuccessJSON': 'JSON do formulário copiado para a área de transferência.',
        'copyErrorHTML': 'Erro ao copiar o HTML.',
        'copyErrorJSON': 'Erro ao copiar o JSON.',
        'initialFieldDeleted': 'O campo',
        'fieldDeleted': 'foi excluído.'
      },
      'de': {
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
        'fieldLabelRequired': 'Die Feldbeschriftung ist erforderlich',
        'text': 'Text',
        'number': 'Zahl',
        'email': 'E-Mail',
        'date': 'Datum',
        'checkbox': 'Kontrollkästchen',
        'radio': 'Radiobutton',
        'select': 'Dropdown',
        'textarea': 'Textbereich',
        'edit': 'Bearbeiten',
        'moveUp': 'Nach oben',
        'moveDown': 'Nach unten',
        'delete': 'Löschen',
        'noOptionsMsg': 'Keine Optionen definiert',
        'errorContainer': 'Ein gültiger HTML-Container ist für FormBuilder erforderlich',
        'errorIdRequired': 'Bitte geben Sie eine ID für das Feld ein.',
        'errorOptionsRequired': 'Bitte fügen Sie mindestens eine Option für diesen Feldtyp hinzu.',
        'errorIdDuplicate': 'Diese ID wird bereits verwendet. Bitte wählen Sie eine eindeutige ID.',
        'errorFormDataArray': 'Formulardaten müssen ein Array sein',
        'errorImportForm': 'Fehler beim Importieren des Formulars:',
        'errorLabelRequired': 'Fehler Die Bezeichnung ist erforderlich',
        'errorHTML': 'Ein gültiger HTML-Container ist für FormBuilder erforderlich',
        "errorHTML": "Ein gültiger HTML-Container wird für FormBuilder benötigt",
        'noDataMsg': 'Keine Daten erfasst',
        "fieldMsg": "Feld",
        "addMsg": "hinzugefügt",
        "updateMsg": "aktualisiert",
        "success": "erfolgreich",
        'copySuccessHTML': 'HTML-Formular in die Zwischenablage kopiert.',
        'copySuccessJSON': 'Formular-JSON in die Zwischenablage kopiert.',
        'copyErrorHTML': 'Fehler beim Kopieren des HTML.',
        'copyErrorJSON': 'Fehler beim Kopieren des JSON.',
        'initialFieldDeleted': 'Feld',
        'fieldDeleted': 'wurde gelöscht.'
      }
    }
  }

  translate(key) {
    const lang = this.options.lang.toLowerCase();;
    if (this.translations[lang] && this.translations[lang][key]) {
      return this.translations[lang][key];
    }
    else if (this.translations['en'] && this.translations['en'][key]) {
      return this.translations['en'][key];
    }
    return key;
  }

  /**
  * Change form language
  */
  setLanguage(lang) {
    if (this.translations[lang]) {
      this.options.lang = lang;
      this.render();
      this.initEvents();
      return true;
    }
    return false;
  }
  /**
   * Renders the main interface
   */
  render() {
    const container = this.options.container;
    container.innerHTML = '';
    container.classList.add('row');

    if (!this.options.previewOnly) {
      this.renderBuilderInterface(container);
    }
    this.renderPreviewInterface(container);
  
    this.fieldData.forEach(field => {
        this.renderFieldToFormPreview(field);
    });
    this.updateCount();
    if(this.options.addHidden){
      this.jsonFormInput.value = JSON.stringify(this.fieldData);
    }
  }

  /**
  * Renders the form builder interface
  */
  renderBuilderInterface(container) {
    const builderCol = document.createElement('div');
    
    builderCol.className = (this.options.enableRealTime && this.options.realtimeLayout === 'column') 
      ? 'col-6' 
      : 'col-12';
    
    const fieldDefinitions = {
      type: {
        label: this.translate('fieldType'),
        render: () => {
          const field = document.createElement('div');
          field.className = 'mb-3';
    
          const label = document.createElement('label');
          label.setAttribute('for', 'type');
          label.textContent = this.translate('fieldType');
          label.className = 'form-label'; 
    
          const options = [
            { value: 'text', text: this.translate('text'), icon: ['M10 12h4', 'M9 4a3 3 0 0 1 3 3v10a3 3 0 0 1 -3 3','M15 4a3 3 0 0 0 -3 3v10a3 3 0 0 0 3 3'] },
            { value: 'number', text: this.translate('number'), icon: ['M11 12h2','M4 10v4a2 2 0 1 0 4 0v-4a2 2 0 1 0 -4 0z','M16 15a1 1 0 0 0 1 1h2a1 1 0 0 0 1 -1v-6a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v2a1 1 0 0 0 1 1h3'] },
            { value: 'email', text: this.translate('email'), icon: ['M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z','M3 7l9 6l9 -6'] },
            { value: 'date', text: this.translate('date'), icon: ['M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z','M16 3v4','M8 3v4','M4 11h16','M7 14h.013','M10.01 14h.005','M13.01 14h.005'] },
            { value: 'checkbox', text: this.translate('checkbox'), icon: ['M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z','M9 12l2 2l4 -4'] },
            { value: 'radio', text: this.translate('radio'), icon: ['M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0','M9 12l2 2l4 -4'] },
            { value: 'select', text: this.translate('select'), icon: ['M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z','M9 11l3 3l3 -3'] },
            { value: 'textarea', text: this.translate('textarea'), icon: ['M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z','M9 13h-2','M13 10h-6','M11 7h-4'] }
          ];
    
          if(this.options.displayMode === 'select') {
            const select = document.createElement('select');
            select.id = 'type';
            select.className = 'form-control';
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
          } else {
              const tabsContainer = document.createElement('div');
              tabsContainer.className = 'tabs-container mb-2';
      
              const tabNav = document.createElement('ul');
              tabNav.className = 'nav nav-tabs';
              tabNav.setAttribute('role', 'tablist');
    
              // Campo oculto para almacenar el valor seleccionado
              const hiddenInput = document.createElement('input');
              hiddenInput.type = 'hidden';
              hiddenInput.id = 'type';
              hiddenInput.value = 'text';
      
              // Función para actualizar el estado activo
              const setActiveTab = (selectedValue) => {
              tabNav.querySelectorAll('.nav-link').forEach(tab => {
                const isActive = tab.getAttribute('data-value') === selectedValue;
                tab.classList.toggle('active', isActive);
                tab.classList.toggle('text-muted', !isActive);
              });
        
              // Actualizar el valor oculto
              hiddenInput.value = selectedValue;
        
              // Disparar evento de cambio
              const changeEvent = new Event('change');
              hiddenInput.dispatchEvent(changeEvent);
            };
      
            options.forEach((type, index) => {
              const tabItem = document.createElement('li');
              tabItem.className = 'nav-item';
              tabItem.setAttribute('role', 'presentation');
            
              const tabButton = document.createElement('button');
              tabButton.className = `nav-link ${index === 0 ? 'active' : 'text-muted'}`;
              tabButton.setAttribute('type', 'button');
              tabButton.setAttribute('role', 'tab');
              tabButton.setAttribute('data-value', type.value);
        
              const icon = this.svgCreate(type.icon);
              tabButton.appendChild(icon);
        
              const labelButton = document.createElement('span');
              labelButton.className = 'ms-1';
              labelButton.style.fontSize = "0.8rem";
              labelButton.textContent = `${type.text}`;
              tabButton.appendChild(labelButton);
        
              // Evento click para todo el botón y sus elementos hijos
              tabButton.addEventListener('click', () => {
                setActiveTab(type.value);
              });
        
              tabItem.appendChild(tabButton);
              tabNav.appendChild(tabItem);
            });
      
            tabsContainer.appendChild(tabNav);
            field.appendChild(tabsContainer);
            field.appendChild(hiddenInput);
      
            this.typeField = hiddenInput;
            return field;
          }
        }
      },
      fieldId: {
        label: this.translate('fieldId'),
        render: () => {
          const field = document.createElement('div');
          field.className = 'mb-3';
          
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
          field.className = 'mb-3';
          
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
          field.className = 'mb-3';
          field.id = 'placeholderFields';
          
          const label = document.createElement('label');
          label.setAttribute('for', 'placeholder');
          label.textContent = this.translate('fieldPlaceholder');
          label.className = 'form-label';
          
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
          field.className = 'mb-3 options-container';
          field.id = `optionsField-${this.options.displayMode}`;
          
          const label = document.createElement('label');
          label.setAttribute('for', 'optionInput');
          label.textContent = this.translate('fieldOptions');
          label.className = 'form-label';
          
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
          field.className = 'mb-3';
          
          const label = document.createElement('label');
          label.setAttribute('for', 'help');
          label.textContent = this.translate('fieldHelp');
          label.className = 'form-label';
          
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
    
    this.options.allowedFields.forEach(fieldName => {
      if (fieldDefinitions[fieldName]) {
        builderCol.appendChild(fieldDefinitions[fieldName].render());
      }
    });
    
    const addButton = document.createElement('button');
    addButton.className = 'w-100 btn btn-primary';
    addButton.textContent = this.translate('addFieldButton');
    addButton.onclick = (event) => {
      event.preventDefault();
      this.addField();
    };
    
    builderCol.appendChild(addButton);
    container.appendChild(builderCol);

    if (this.options.enableRealTime) {
      const realTimeContainer = document.createElement('div');
      if (this.options.realtimeLayout === 'column') {
          realTimeContainer.className = "col-6";
        } else {
          realTimeContainer.className = "col-12 mt-3";
        }
      const previewTitle = document.createElement('label');
      previewTitle.textContent =  this.translate('realtimePreviewTitle');
      realTimeContainer.appendChild(previewTitle);
      
      const realTimePreview = document.createElement('div');
      realTimePreview.id = 'realTimePreview';
      realTimePreview.className = 'form-control p-3';

      this.realTimePreview = realTimePreview;
      realTimeContainer.appendChild(realTimePreview);
      container.appendChild(realTimeContainer);
    }
  }

  updateCount(){
    if (this.options.previewMode === 'modal') {
      document.getElementById('previewBtn').innerHTML = `
      ${this.translate('formPreviewTitle')}
      <span class="badge bg-success  ms-2 badge-notifications">${this.fieldData.length}</span>
    `;
    }    
  }
  /**
  * Renders the form preview interface
  */
  renderPreviewInterface(container) {
    if (this.options.previewMode === 'modal') {

      const previewBtnCol = document.createElement('div');
      previewBtnCol.className = 'col-12 mt-3';
      const previewBtn = document.createElement('button');
      previewBtn.className = 'w-100 btn btn-outline-success text-nowrap d-inline-block waves-effect';
      previewBtn.setAttribute('id', 'previewBtn');
      previewBtn.innerHTML = `
      ${this.translate('formPreviewTitle')}
      <span class="badge bg-success  ms-2 badge-notifications">${this.fieldData.length}</span>`;
      previewBtn.onclick = (e) => {
        e.preventDefault();
        this.createAndOpenPreviewModal();
      };
      previewBtnCol.appendChild(previewBtn);
      container.appendChild(previewBtnCol);
    } 
    else {
      const previewCol = document.createElement('div');
      previewCol.setAttribute('id', 'previewCol');
      previewCol.className = 'col-12 mt-3';
    
      const previewTitle = document.createElement('h5');
      if(this.options.previewTitle !== null ){
        previewTitle.textContent = this.options.previewTitle;
      }else{
        previewTitle.textContent = this.translate('formPreviewTitle');
      }
      previewCol.appendChild(previewTitle);
      this.addInitialForm(previewCol);
    
      const formPreview = document.createElement('div');
      formPreview.id = 'formPreview';
      this.formPreview = formPreview;
    
      previewCol.appendChild(formPreview);
      container.appendChild(previewCol);
    }
    if(this.options.addHidden){
      const jsonFormInput = document.createElement('input');
      jsonFormInput.type = 'hidden';
      jsonFormInput.id = this.options.inputHidden;
      jsonFormInput.name = this.options.inputHidden;
      this.jsonFormInput = jsonFormInput;
      container.appendChild(jsonFormInput);
    }
    
  }
  
  addInitialForm(element){
    if(this.fieldData.length == 0){
        const initalForm = document.createElement('div');
        initalForm.setAttribute('id', 'initalForm');
        initalForm.className="form-control";
        initalForm.innerHTML=`<h5 class="text-muted">${this.translate('noDataMsg')}<h5>`;
        element.appendChild(initalForm);
      }
  }

  removeInitialForm() {
    const initalForm = document.getElementById('initalForm');
    if (initalForm && initalForm.parentNode) {
      initalForm.parentNode.removeChild(initalForm);
    }
  }

  /**
  * Create and open the preview modal
  */
  createAndOpenPreviewModal() {
    this.removeExistingModal();
  
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'formPreviewModal';
    modal.tabIndex = -1;
    modal.setAttribute('aria-hidden', 'true');
    
    const modalDialog = document.createElement('div');
    modalDialog.className = 'modal-dialog modal-lg modal-dialog-centered';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    
    const modalTitle = document.createElement('h5');
    modalTitle.className = 'modal-title';
    modalTitle.textContent = this.translate('formPreviewTitle');
    
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'btn-close';
    closeBtn.setAttribute('data-bs-dismiss', 'modal');
    closeBtn.setAttribute('aria-label', 'Close');
    
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeBtn);
    
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    
    const formPreview = document.createElement('div');
    formPreview.id = 'formPreview';
    this.formPreview = formPreview;
    this.addInitialForm(formPreview);
    
    modalBody.appendChild(formPreview);
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalDialog.appendChild(modalContent);
    modal.appendChild(modalDialog);
    
    document.body.appendChild(modal);
  
    this.fieldData.forEach(field => {
      this.renderFieldToFormPreview(field);
    });

    this.setupModalDestroyOnClose(modal);

    this.openPreviewModal();
  }

  /**
  * Removes the existing modal if there is one
  */
  removeExistingModal() {
    const existingModal = document.getElementById('formPreviewModal');
    if (existingModal) {
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(backdrop => backdrop.remove());
      existingModal.remove();
    }
  }

  /**
  * Set the modal to be destroyed when closed
  */
  setupModalDestroyOnClose(modal) {
    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
      modal.addEventListener('hidden.bs.modal', () => {
        this.removeExistingModal();
      });
    } else {
      const closeButtons = modal.querySelectorAll('[data-bs-dismiss="modal"]');
      closeButtons.forEach(button => {
        button.addEventListener('click', () => {
          this.closeModal(modal);
          setTimeout(() => this.removeExistingModal(), 300);
        });
      });
      modal.addEventListener('click', (event) => {
        if (event.target === modal) {
          this.closeModal(modal);
          setTimeout(() => this.removeExistingModal(), 300);
        }
      });
    }
  }

  /**
  * Open the preview modal
  */
  openPreviewModal() {
    const modalElement = document.getElementById('formPreviewModal');
    if (!modalElement) return;
  
    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    } else {
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
      document.body.classList.add('modal-open');
    
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
    }
  }

  /**
  * Close the modal manually (when not using Bootstrap)
  */
  closeModal(modalElement) {
    modalElement.classList.remove('show');
    modalElement.style.display = 'none';
    document.body.classList.remove('modal-open');

    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => {
      backdrop.remove();
    });
  }
  /*
  * Initializes interface events
  */
  initEvents() {
    if (this.options.previewOnly) return;
    
    this.typeField.addEventListener('change', () => {
      this.optionList = [];
      this.optionTags.innerHTML = '';
      this.updateOptionsVisibility();
    });
    
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
      this.optionInput.addEventListener('input', () => {
        this.clearValidationErrorForField(this.optionInput);
      });
    }
    
    const updateFields = [this.typeField, this.labelField, this.placeholderField, this.helpField, this.fieldIdField];
    
    let debounceTimer;
    const debounce = (callback, time) => {
      window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(callback, time);
    };
    
    updateFields.forEach(field => {
      if (field) {
        // Usar input para actualización inmediata pero con debounce
        field.addEventListener('input', () => {
          const valueInput = field.value.trim();
          if (valueInput === '') {
            if(field.id == 'fieldId'){
              this.showValidationError(field, this.translate('errorIdRequired'));
            }
            if(field.id == 'label'){
              this.showValidationError(field, this.translate('errorLabelRequired'));
            }
          } else {
            this.clearValidationErrorForField(field);
          }
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
  * Clear errors from a specific field
  */
  clearValidationErrorForField(inputElement) {
    const errorElement = inputElement.parentNode.querySelector('.validation-error');
    if (errorElement) {
      errorElement.remove();
      inputElement.style.borderColor = '';
      inputElement.classList.remove('fv-plugins-bootstrap5-row-invalid');
    }
  }

  /**
   * Updates the visibility of the options field
   */
  updateOptionsVisibility() {
    if (this.options.previewOnly) return;
    
    const type = this.typeField.value;
    console.log(type);
    const optionsField = document.getElementById(`optionsField-${this.options.displayMode}`);
    const placeholderFields = document.getElementById('placeholderFields');
    
    if (optionsField) {
      optionsField.style.display = (type === 'select' || type === 'radio' || type === 'checkbox') ? 'block' : 'none';
    }
    
    if (placeholderFields) {
      placeholderFields.style.display = (type === 'select' || type === 'radio' || type === 'checkbox' || type === 'date') ? 'none' : 'block';
    }
    
    this.renderRealTimePreview();
  }

  /**
  * Renders option labels
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
  * Render the preview in real time
  */
  renderRealTimePreview() {
    if (this.options.previewOnly || !this.realTimePreview) return;
    
    const type = this.typeField.value;
    const label = this.labelField.value;
    const placeholder = this.placeholderField ? this.placeholderField.value : '';
    const help = this.helpField ? this.helpField.value : '';
    const id = this.fieldIdField.value;
    const name = this.fieldIdField.value;

    if (!id) {
      this.realTimePreview.innerHTML = `<p class="text-muted">${this.translate('fieldIdRequired')}</p>`;
      return;
    }
    
    this.realTimePreview.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'mb-3';

    if (label) {
      const labelEl = document.createElement('label');
      labelEl.textContent = label;
      labelEl.className = "form-label";
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
      
      if (this.optionList.length === 0) {
        const noOptionsMsg = document.createElement('div');
        noOptionsMsg.textContent = this.translate('noOptionsMsg');
        noOptionsMsg.style.fontStyle = 'italic';
        noOptionsMsg.style.color = '#777';
        optionsContainer.appendChild(noOptionsMsg);
      } else {
        this.optionList.forEach(opt => {
          const optWrapper = document.createElement('div');
          optWrapper.className = 'form-check form-check-inline';
          
          const optInput = document.createElement('input');
          optInput.type = type;
          optInput.name = type === 'radio' ? name : `${name}[]`;
          optInput.value = opt;
          optInput.className="form-check-input";
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
      helpEl.className = 'form-text';
      helpEl.textContent = help;
      wrapper.appendChild(helpEl);
    }

    this.realTimePreview.appendChild(wrapper);
    
    const previewNote = document.createElement('div');
    previewNote.className = 'mt-3 text-muted';
    previewNote.textContent = this.translate('previewNote');
    this.realTimePreview.appendChild(previewNote);
  }

  /**
  * Create an SVG element for controls
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
  * Create a field element for preview
  */
  createFieldElement(field, values = null) {
    const wrapper = document.createElement('div');
    wrapper.className = 'mb-3 form-control';
  
    if (field.label) {
      const labelEl = document.createElement('label');
      labelEl.textContent = field.label;
      labelEl.className = "form-label";
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
    
      // Rellenar con valor si existe
      if (values && values[field.name]) {
        input.value = values[field.name];
      }
    
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
    
    // Rellenar con valor si existe
      if (values && values[field.name]) {
        input.value = values[field.name];
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
          optWrapper.className = 'form-check form-check-inline';
        
          const optInput = document.createElement('input');
          optInput.type = field.type;
          optInput.name = field.type === 'radio' ? field.name : `${field.name}[]`;
          optInput.value = opt;
          optInput.className = "form-check-input";
          optInput.id = `${field.id}_${opt}`;
        
          // Marcar checkbox/radio si el valor coincide o está en el array
          if (values && values[field.name]) {
            if (field.type === 'checkbox' && Array.isArray(values[field.name])) {
              optInput.checked = values[field.name].includes(opt);
            } else if (field.type === 'radio') {
              optInput.checked = values[field.name] === opt;
            }
          }
        
          const optLabel = document.createElement('label');
          optLabel.textContent = opt;
          optLabel.className = "form-check-label";
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
    
      // Rellenar con valor si existe
      if (values && values[field.name]) {
        input.value = values[field.name];
      }
    
      wrapper.appendChild(input);
    }
  
    if (field.help) {
      const helpEl = document.createElement('div');
      helpEl.className = 'form-text';
      helpEl.textContent = field.help;
      wrapper.appendChild(helpEl);
    }
  
    return wrapper;
  }

  /**
  * Renders a field in the form preview
  */
  renderFieldToFormPreview(field) {
    const fieldElement = this.createFieldElement(field,this.options.initialValues);
    
    const wrapper = document.createElement('div');
    wrapper.className = 'field-wrapper';
    wrapper.dataset.fieldId = field.id;
    wrapper.style.position = 'relative';
    wrapper.style.marginBottom = '15px';
    wrapper.appendChild(fieldElement);

    if (this.options.showFieldControls && !this.options.previewOnly) {
      const controls = document.createElement('div');
      controls.className = 'field-controls';
      controls.style.position = 'absolute';
      controls.style.top = '1px';
      controls.style.right = '5px';
      controls.style.padding = '2px';
      controls.style.borderRadius = '3px';

      const btnEdit = document.createElement('span');
      btnEdit.appendChild(this.svgCreate(['M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1', 'M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z','M16 5l3 3']));
      btnEdit.title = this.translate('edit');
      btnEdit.onclick = () => {
        this.enterEditMode(field.id);
      };

      const btnUp = document.createElement('span');
      btnUp.appendChild(this.svgCreate(['M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z','M9 13l3 -3l3 3']));
      btnUp.title = this.translate('moveUp');
      btnUp.onclick = () => {
        if (wrapper.previousElementSibling) {
          this.formPreview.insertBefore(wrapper, wrapper.previousElementSibling);
          this.reorderFieldData();
          this.updateJSONView();
        }
      };

      const btnDown = document.createElement('span');
      btnDown.appendChild(this.svgCreate(['M15 11l-3 3l-3 -3','M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z']));
      btnDown.title = this.translate('moveDown');
      btnDown.onclick = () => {
        if (wrapper.nextElementSibling) {
          this.formPreview.insertBefore(wrapper.nextElementSibling, wrapper);
          this.reorderFieldData();
          this.updateJSONView();
        }
      };

      const btnDelete = document.createElement('span');
      btnDelete.appendChild(this.svgCreate(['M4 7l16 0','M10 11l0 6','M14 11l0 6','M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12','M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3']));
      btnDelete.title = this.translate('delete');
      btnDelete.onclick = () => {
        const index = this.fieldData.findIndex(f => f.id === field.id);
        if (index !== -1) this.fieldData.splice(index, 1);
        wrapper.remove();
        this.showTemporaryMessage(`${this.translate('initialFieldDeleted')} "${field.label}" ${this.translate('fieldDeleted')}`, 'danger');
        this.addInitialForm(this.formPreview);
        this.updateCount();
        this.updateJSONView();
      };

      [btnEdit, btnUp, btnDown, btnDelete].forEach(btn => {
        btn.style.cursor = 'pointer';
        btn.style.padding = '2px 6px';
        controls.appendChild(btn);
      });

      wrapper.appendChild(controls);
    }
    if(this.formPreview){
      this.formPreview.appendChild(wrapper);
    }
  }
  
  /**
   * Display temporary messages 
   */
  showTemporaryMessage(message, type = 'success', duration = 3000) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} fade show position-fixed`;
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.maxWidth = '300px';
    alertDiv.innerHTML = message;
  
    document.body.appendChild(alertDiv);
  
    setTimeout(() => {
      alertDiv.classList.add('fade');
      alertDiv.style.opacity = '0';
      setTimeout(() => {
        alertDiv.remove();
      }, 300);
    }, duration); 
  }

  /**
  * Add a new field to the form
  */
  addField() {
    const type = this.typeField.value;
    const label = this.labelField.value.trim();
    const id = this.fieldIdField.value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_');
    const placeholder = this.placeholderField ? this.placeholderField.value.trim() : '';
    const help = this.helpField ? this.helpField.value.trim() : '';
    const name = id;
  
    this.clearValidationErrors();
  
    let isValid = true;
    
    if (!id) {
      this.showValidationError(this.fieldIdField, this.translate('errorIdRequired'));
      isValid = false;
    }
    
    if (!label) {
      this.showValidationError(this.labelField, this.translate('errorLabelRequired'));
      isValid = false;
    }
    
    if ((type === 'select' || type === 'radio' || type === 'checkbox') && this.optionList.length === 0) {
      this.showValidationError(this.optionInput, this.translate('errorOptionsRequired'));
      isValid = false;
    }
    
    if (this.editingId === null && this.fieldData.some(f => f.id === id)) {
      this.showValidationError(this.fieldIdField, this.translate('errorIdDuplicate'));
      isValid = false;
    } else if (this.editingId !== null && this.editingId !== id && this.fieldData.some(f => f.id === id)) {
      this.showValidationError(this.fieldIdField, this.translate('errorIdDuplicate'));
      isValid = false;
    }
    
    if (!isValid) return;
    
    if (this.editingId !== null) {
      const oldWrapper = this.formPreview.querySelector(`[data-field-id="${this.editingId}"]`);
      if (oldWrapper) {
        oldWrapper.remove();
      }
    }
    const actionText = this.editingId !== null ? this.translate('updateMsg') : this.translate('addMsg');
    this.showTemporaryMessage(`${this.translate('fieldMsg')} "${label}" ${actionText} ${this.translate('success')}.`, 'success');

    const newField = {
      id,
      name,
      label,
      type,
      placeholder,
      help,
      options: ['select', 'radio', 'checkbox'].includes(type) ? [...this.optionList] : []
    };
    
    if (this.editingId !== null) {
      const index = this.fieldData.findIndex(f => f.id === this.editingId);
      if (index !== -1) {
        this.fieldData[index] = newField;
      }
    } else {
      this.fieldData.push(newField);
    }
    
    this.renderFieldToFormPreview(newField);
    this.updateJSONView();
    
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
    this.updateCount();
    this.removeInitialForm();
    if (typeof this.options.onChange === 'function') {
      this.options.onChange(this.fieldData);
    }
  }
  /**
   * Display validation error message below an input field
   * @param {HTMLElement} inputElement - The input field with the error
   * @param {string} message - The error message to display
   */
  showValidationError(inputElement, message) {
    let errorElement = inputElement.parentNode.querySelector('.validation-error');
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'validation-error text-danger';
      inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
    }
    
    errorElement.textContent = message;
    
    inputElement.style.borderColor = '#d32f2f';
    inputElement.classList.add('fv-plugins-bootstrap5-row-invalid');
  }
    
  /**
  * Clear all validation error messages
  */
  clearValidationErrors() {
    const errorElements = document.querySelectorAll('.validation-error');
    errorElements.forEach(el => el.remove());
    
    const inputs = [
      this.labelField, 
      this.fieldIdField,
      this.placeholderField,
      this.helpField,
      this.optionInput
    ].filter(el => el);
    
    inputs.forEach(input => {
      if (input) {
        input.style.borderColor = '';
        input.classList.remove('error');
      }
    });
  }

  /**
  * Update the JSON view of the form
  */
  updateJSONView() {
    if (this.jsonFormInput) {
      this.jsonFormInput.value = JSON.stringify(this.fieldData);
    }
    
    if (typeof this.options.onChange === 'function') {
      this.options.onChange(this.fieldData);
    }

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
  * Highlights JSON syntax to display it in color
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
  * Reorders field data according to their order in the DOM
  */
  reorderFieldData() {
    const wrapperOrder = Array.from(this.formPreview.children).map(wrapper => wrapper.dataset.fieldId);
    
    this.fieldData.sort((a, b) => {
      const indexA = wrapperOrder.indexOf(a.id);
      const indexB = wrapperOrder.indexOf(b.id);
      
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
  
      return 0;
    });
  }

  /**
  * Enter edit mode for a specific field
  */
  enterEditMode(id) {
    if (this.options.previewOnly) return;
    
    if (this.options.previewMode === 'modal') {
      const modalElement = document.getElementById('formPreviewModal');
      if (modalElement) {
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
      }
    }
    const field = this.fieldData.find(f => f.id === id);
    if (!field) return;

    this.editingId = id;
    
    this.typeField.value = field.type;
    this.labelField.value = field.label;
    this.fieldIdField.value = field.id;
    if (this.placeholderField) this.placeholderField.value = field.placeholder || '';
    if (this.helpField) this.helpField.value = field.help || '';
    
    this.optionList = field.options ? [...field.options] : [];
    this.renderOptionTags();
    
    this.updateOptionsVisibility();
    
    this.typeField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if(this.options.displayMode === 'tabs'){
      const tabButtons = this.options.container.querySelectorAll('.tabs-container .nav-link');
      tabButtons.forEach(tab => {
        if (tab.getAttribute('data-value') === field.type) {
          tab.click();
        }
      });
    }
  }

  /**
  * Gets form data as JSON
  */
  getFormData() {
    return this.fieldData;
  }

  /**
  * Sets form data from a JSON object
  */
  setFormData(data) {
    if (!Array.isArray(data)) {
      throw new Error(this.translate('errorFormDataArray'));
    }
    
    this.fieldData = [...data];
    
    this.formPreview.innerHTML = '';
    
    this.fieldData.forEach(field => {
      this.renderFieldToFormPreview(field);
    });
    
    this.updateJSONView();
  }

  /**
  * Generates the form HTML based on the current data
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
  * Export the form as JSON
  */
  exportFormJSON() {
    return JSON.stringify(this.fieldData);
  }

  copyFormHTMLToClipboard() {
    const html = this.generateFormHTML();
    navigator.clipboard.writeText(html)
      .then(() => this.showTemporaryMessage(this.translate('copySuccessHTML')))
      .catch(err => this.showTemporaryMessage(this.translate('copyErrorHTML'),'danger'));
  }

  copyFormJSONToClipboard() {
    const json = this.exportFormJSON();
    navigator.clipboard.writeText(json)
      .then(() => this.showTemporaryMessage(this.translate('copySuccessJSON')))
      .catch(err => this.showTemporaryMessage(this.translate('copyErrorJSON'),'danger'));
  }

  /**
  * Import a form from JSON
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
