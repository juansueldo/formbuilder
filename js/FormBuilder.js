
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
      realtimeLayout: 'column',
      previewMode: 'modal',
      lang: 'en',
      ...options
    };
    this._initTranslations();
    // Validar el contenedor
    if (!this.options.container || !(this.options.container instanceof HTMLElement)) {
      throw new Error(this.translations('errorHTML'));
    }

    // Estado interno
    this.fieldData = [...this.options.initialData];
    this.optionList = [];
    this.editingId = null;
    
    // Inicializar
    
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
        'errorLabelRequired': 'Error el label es requerido',
        'errorHTML': 'Se requiere un contenedor HTML válido para FormBuilder',
        "errorHTML": "Se requiere un contenedor HTML válido para FormBuilder",
        "fieldMsg": "Campo",
        "addMsg": "agregado",
        "updateMsg": "actualizado",
        "success": "correctamente"
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
        'errorLabelRequired': 'Error the label is required',
        'errorHTML': 'A valid HTML container is required for FormBuilder',
        "errorHTML": "A valid HTML container is required for FormBuilder",
        "fieldMsg": "Field",
        "addMsg": "added",
        "updateMsg": "updated",
        "success": "successfully"
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
        'errorLabelRequired': 'Erreur le libellé est requis',
        'errorHTML': 'Un conteneur HTML valide est requis pour FormBuilder',
        "errorHTML": "Un conteneur HTML valide est requis pour FormBuilder",
        "fieldMsg": "Champ",
        "addMsg": "ajouté",
        "updateMsg": "mis à jour",
        "success": "avec succès"
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

        // Tipos de campo
        'text': 'Texto',
        'number': 'Número',
        'email': 'Email',
        'date': 'Data',
        'checkbox': 'Checkbox',
        'radio': 'Radio',
        'select': 'Select',
        'textarea': 'Área de texto',

        // Controles de campo
        'edit': 'Editar',
        'moveUp': 'Subir',
        'moveDown': 'Descer',
        'delete': 'Excluir',

        // Mensagens
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
        "fieldMsg": "Campo",
        "addMsg": "adicionado",
        "updateMsg": "atualizado",
        "success": "com sucesso"
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
        'errorLabelRequired': 'Fehler Die Bezeichnung ist erforderlich',
        'errorHTML': 'Ein gültiger HTML-Container ist für FormBuilder erforderlich',
        "errorHTML": "Ein gültiger HTML-Container wird für FormBuilder benötigt",
        "fieldMsg": "Feld",
        "addMsg": "hinzugefügt",
        "updateMsg": "aktualisiert",
        "success": "erfolgreich"
      }
    }
  }

  translate(key) {
    const lang = this.options.lang.toLowerCase();;
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
      this.initEvents();
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
    container.classList.add('row');

    if (!this.options.previewOnly) {
      this.renderBuilderInterface(container);
    }
    // Siempre mostrar la vista previa
    this.renderPreviewInterface(container);
    
    // Inicializar campos desde los datos iniciales
    this.fieldData.forEach(field => {
        this.renderFieldToFormPreview(field);
    });
    this.updateCount();
    this.jsonFormInput.value = JSON.stringify(this.fieldData);
  }

  /**
   * Renderiza la interfaz del constructor de formularios
   */
  renderBuilderInterface(container) {
    const builderCol = document.createElement('div');
    
    builderCol.className = (this.options.enableRealTime && this.options.realtimeLayout === 'column') 
      ? 'col-6' 
      : 'col-12';
    
    // Definir todos los campos posibles
    const fieldDefinitions = {
      type: {
        label: this.translate('fieldType'),
        render: () => {
          const field = document.createElement('div');
          field.className = 'mb-3';
          
          const label = document.createElement('label');
          label.setAttribute('for', 'type');
          label.textContent = this.translate('fieldType');
          label.class = 'form-label';
          
          const select = document.createElement('select');
          select.id = 'type';
          select.className = 'form-control';
          
          const options = [
            { value: 'text', text: this.translate('text') },
            { value: 'number', text: this.translate('number') },
            { value: 'email', text: this.translate('email') },
            { value: 'date', text: this.translate('date') },
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
          field.id = 'optionsField';
          
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
    
    // Renderizar solo los campos permitidos
    this.options.allowedFields.forEach(fieldName => {
      if (fieldDefinitions[fieldName]) {
        builderCol.appendChild(fieldDefinitions[fieldName].render());
      }
    });
    
    // Botón para agregar campos
    const addButton = document.createElement('button');
    addButton.className = 'w-100 btn btn-primary';
    addButton.textContent = this.translate('addFieldButton');
    addButton.onclick = (event) => {
      event.preventDefault();
      this.addField();
    };
    
    builderCol.appendChild(addButton);
    container.appendChild(builderCol);
    // Vista previa en tiempo real
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
    <span class="badge bg-light text-dark ms-2">${this.fieldData.length}</span>
    `;
    }    
  }
 /**
* Renderiza la interfaz de vista previa del formulario
* Versión mejorada que permite destruir y recrear el modal
*/
renderPreviewInterface(container) {
  if (this.options.previewMode === 'modal') {
    // Crear botón para abrir modal
    const previewBtnCol = document.createElement('div');
    previewBtnCol.className = 'col-12 mt-3';
    const previewBtn = document.createElement('button');
    previewBtn.className = 'btn btn-info w-100';
    previewBtn.setAttribute('id', 'previewBtn');
    previewBtn.innerHTML = `
    ${this.translate('formPreviewTitle')}
    <span class="badge bg-light text-dark ms-2">${this.fieldData.length}</span>
    `;
    previewBtn.onclick = (e) => {
      e.preventDefault(); // evita el envío del formulario
      this.createAndOpenPreviewModal(); // Crea y abre el modal cada vez
    };
    previewBtnCol.appendChild(previewBtn);
    container.appendChild(previewBtnCol);
    
    // No creamos el modal aquí, lo haremos dinámicamente cada vez que se necesite
  } 
  else {
    // Versión inline original
    const previewCol = document.createElement('div');
    previewCol.className = 'col-12 mt-3';
    
    const previewTitle = document.createElement('h5');
    previewTitle.textContent = this.translate('formPreviewTitle');
    previewCol.appendChild(previewTitle);
    
    const formPreview = document.createElement('div');
    formPreview.id = 'formPreview';
    formPreview.className = 'form-control';
    this.formPreview = formPreview;
    
    previewCol.appendChild(formPreview);
    container.appendChild(previewCol);
  }
  
  // Input oculto para almacenar el JSON del formulario (igual para ambos modos)
  const jsonFormInput = document.createElement('input');
  jsonFormInput.type = 'hidden';
  jsonFormInput.id = this.options.inputHidden;
  jsonFormInput.name = this.options.inputHidden;
  this.jsonFormInput = jsonFormInput;
  
  container.appendChild(jsonFormInput);
}

/**
 * Crea y abre el modal de vista previa
 * Se llama cada vez que se quiere abrir el modal
 */
createAndOpenPreviewModal() {
  // Eliminar modal anterior si existe
  this.removeExistingModal();
  
  // Crear el modal dinámicamente
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
  
  modalBody.appendChild(formPreview);
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modalDialog.appendChild(modalContent);
  modal.appendChild(modalDialog);
  
  // Agregar el modal al body
  document.body.appendChild(modal);
  
  // Renderizar el contenido del formulario en la vista previa
  this.fieldData.forEach(field => {
    this.renderFieldToFormPreview(field);
  });
  
  // Configurar el listener para destruir el modal al cerrarse
  this.setupModalDestroyOnClose(modal);
  
  // Abrir el modal
  this.openPreviewModal();
}

/**
 * Elimina el modal existente si hay uno
 */
removeExistingModal() {
  const existingModal = document.getElementById('formPreviewModal');
  if (existingModal) {
    // Remover también el backdrop si existe
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());
    
    // Eliminar el modal
    existingModal.remove();
  }
}

/**
 * Configura el modal para destruirse al cerrarse
 */
setupModalDestroyOnClose(modal) {
  if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
    // Usar eventos de Bootstrap
    modal.addEventListener('hidden.bs.modal', () => {
      this.removeExistingModal();
    });
  } else {
    // Configuración manual para el cierre
    const closeButtons = modal.querySelectorAll('[data-bs-dismiss="modal"]');
    closeButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.closeModal(modal);
        setTimeout(() => this.removeExistingModal(), 300); // Dar tiempo a la animación
      });
    });
    
    // Cerrar al hacer clic fuera
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        this.closeModal(modal);
        setTimeout(() => this.removeExistingModal(), 300);
      }
    });
  }
}

/**
 * Abre el modal de vista previa
 */
openPreviewModal() {
  const modalElement = document.getElementById('formPreviewModal');
  if (!modalElement) return;
  
  // Si Bootstrap 5 está disponible, usar su API
  if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
  } else {
    // Fallback manual si Bootstrap no está disponible
    modalElement.classList.add('show');
    modalElement.style.display = 'block';
    document.body.classList.add('modal-open');
    
    // Crear backdrop (fondo oscuro)
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    document.body.appendChild(backdrop);
  }
}

/**
 * Cierra el modal manualmente (cuando no se usa Bootstrap)
 */
closeModal(modalElement) {
  modalElement.classList.remove('show');
  modalElement.style.display = 'none';
  document.body.classList.remove('modal-open');
  
  // Eliminar todos los backdrops
  const backdrops = document.querySelectorAll('.modal-backdrop');
  backdrops.forEach(backdrop => {
    backdrop.remove();
  });
}/*
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
    this.optionInput.addEventListener('input', () => {
      this.clearValidationErrorForField(this.optionInput);
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
  // Añade este nuevo método para limpiar errores de un campo específico
  clearValidationErrorForField(inputElement) {
      const errorElement = inputElement.parentNode.querySelector('.validation-error');
      if (errorElement) {
        errorElement.remove();
        inputElement.style.borderColor = '';
        inputElement.classList.remove('fv-plugins-bootstrap5-row-invalid');
      }
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
      this.realTimePreview.innerHTML = `<p class="text-danger">${this.translate('fieldIdRequired')}</p>`;
      return;
    }
    
    this.realTimePreview.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'mb-3';

    // Añadir etiqueta principal
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
      helpEl.className = 'form-text';
      helpEl.textContent = help;
      wrapper.appendChild(helpEl);
    }

    this.realTimePreview.appendChild(wrapper);
    
    // Añadir mensaje adicional para mejor UX
    const previewNote = document.createElement('div');
    previewNote.className = 'mt-3 text-muted';
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
      helpEl.className = 'form-text';
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
      controls.style.top = '1px';
      controls.style.right = '5px';
      //controls.style.background = 'rgba(255, 255, 255, 0.8)';
      controls.style.padding = '2px';
      controls.style.borderRadius = '3px';

      const btnEdit = document.createElement('span');
      btnEdit.appendChild(this.svgCreate(['M12 20h9', 'M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5']));
      btnEdit.title = this.translate('edit');
      btnEdit.onclick = () => {
        this.enterEditMode(field.id);
      };

      const btnUp = document.createElement('span');
      btnUp.appendChild(this.svgCreate(['M12 5l0 14','M16 9l-4 -4','M8 9l4 -4']));
      btnUp.title = this.translate('moveUp');
      btnUp.onclick = () => {
        if (wrapper.previousElementSibling) {
          this.formPreview.insertBefore(wrapper, wrapper.previousElementSibling);
          this.reorderFieldData();
          this.updateJSONView();
        }
      };

      const btnDown = document.createElement('span');
      btnDown.appendChild(this.svgCreate(['M12 5l0 14','M16 15l-4 4','M8 15l4 4']));
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
        this.updateCount();
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
    if(this.formPreview){
      this.formPreview.appendChild(wrapper);
    }
  }
  // Añade este método para mostrar mensajes temporales
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
* Añade un nuevo campo al formulario
*/
addField() {
  const type = this.typeField.value;
  const label = this.labelField.value.trim();
  const id = this.fieldIdField.value.trim().toLowerCase();
  const placeholder = this.placeholderField ? this.placeholderField.value.trim() : '';
  const help = this.helpField ? this.helpField.value.trim() : '';
  const name = this.fieldIdField.value.trim().toLowerCase();
  
  // Clear any previous error messages
  this.clearValidationErrors();
  
  // Validation checks
  let isValid = true;
  
  if (!id) {
    this.showValidationError(this.fieldIdField, this.translate('errorIdRequired'));
    isValid = false;
  }
  
  if (!label) {
    this.showValidationError(this.labelField, this.translate('errorLabelRequired'));
    isValid = false;
  }
  
  // Verify options exist for types that require them
  if ((type === 'select' || type === 'radio' || type === 'checkbox') && this.optionList.length === 0) {
    // Assuming optionInput is the field where users enter options
    this.showValidationError(this.optionInput, this.translate('errorOptionsRequired'));
    isValid = false;
  }
  
  // Check for duplicate IDs
  if (this.editingId === null && this.fieldData.some(f => f.id === id)) {
    this.showValidationError(this.fieldIdField, this.translate('errorIdDuplicate'));
    isValid = false;
  } else if (this.editingId !== null && this.editingId !== id && this.fieldData.some(f => f.id === id)) {
    this.showValidationError(this.fieldIdField, this.translate('errorIdDuplicate'));
    isValid = false;
  }
  
  // If validation failed, stop here
  if (!isValid) return;
  
  // If we're in edit mode, remove the previous field
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
  
  // Update or add to the data array
  if (this.editingId !== null) {
    const index = this.fieldData.findIndex(f => f.id === this.editingId);
    if (index !== -1) {
      this.fieldData[index] = newField;
    }
  } else {
    // Add new field
    this.fieldData.push(newField);
  }
  
  // Render the field to the preview form
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
    this.updateCount();
  // Call the callback if it exists
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
      // Create error element if it doesn't exist
      let errorElement = inputElement.parentNode.querySelector('.validation-error');
      
      if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'validation-error text-danger';
        
        // Insert error message after the input
        inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
      }
      
      errorElement.textContent = message;
      
      // Highlight the input field
      inputElement.style.borderColor = '#d32f2f';
      inputElement.classList.add('fv-plugins-bootstrap5-row-invalid');
    }
    
    /**
     * Clear all validation error messages
     */
    clearValidationErrors() {
      // Remove all error messages
      const errorElements = document.querySelectorAll('.validation-error');
      errorElements.forEach(el => el.remove());
      
      // Reset input styling
      const inputs = [
        this.labelField, 
        this.fieldIdField,
        this.placeholderField,
        this.helpField,
        this.optionInput
      ].filter(el => el); // Filter out null/undefined elements
      
      inputs.forEach(input => {
        if (input) {
          input.style.borderColor = '';
          input.classList.remove('error');
        }
      });
    }

  /**
   * Actualiza la vista JSON del formulario
   */
  updateJSONView() {
    // Actualizar el input oculto con los datos actuales
    if (this.jsonFormInput) {
      this.jsonFormInput.value = JSON.stringify(this.fieldData);
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
    return JSON.stringify(this.fieldData);
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