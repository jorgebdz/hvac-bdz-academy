const HVAC_BDZ_RESPUESTAS_ID = '1UmtBWw4fZvQnk0hK_LTnvC1ebAQxHIj275qUS1Ydyr4';

function crearFormulariosM2() {
  const ss = SpreadsheetApp.openById(HVAC_BDZ_RESPUESTAS_ID);
  const links = ss.getSheetByName('ENLACES_PARA_ACADEMY') || ss.insertSheet('ENLACES_PARA_ACADEMY');
  asegurarEncabezadosM2_(links);

  const diag = crearDiagnosticoM2_(ss);
  const formativa = crearFormativaM2_(ss);
  const finalM2 = crearFinalM2_(ss);
  const encuesta = crearEncuestaM2_(ss);

  registrarEnlaceM2_(links, 'Evaluación diagnóstica M2', 'Participante antes de iniciar el Módulo 2', diag);
  registrarEnlaceM2_(links, 'Actividad formativa M2', 'Participante durante el Módulo 2', formativa);
  registrarEnlaceM2_(links, 'Evaluación final M2', 'Participante al cierre del Módulo 2', finalM2);
  registrarEnlaceM2_(links, 'Encuesta de cierre M2', 'Participante después del Módulo 2', encuesta);

  crearTableroM2_(ss, {diag, formativa, finalM2, encuesta});
  SpreadsheetApp.flush();

  Logger.log('M2 creado correctamente.');
  Logger.log('Diagnóstico: ' + diag.getPublishedUrl());
  Logger.log('Formativa: ' + formativa.getPublishedUrl());
  Logger.log('Final: ' + finalM2.getPublishedUrl());
  Logger.log('Encuesta: ' + encuesta.getPublishedUrl());
}

function prepararFormularioM2_(propiedad, titulo, descripcion, quiz) {
  const props = PropertiesService.getScriptProperties();
  let form;
  const id = props.getProperty(propiedad);
  if (id) {
    try { form = FormApp.openById(id); } catch (e) {}
  }
  if (!form) {
    form = FormApp.create(titulo);
    props.setProperty(propiedad, form.getId());
  }
  const items = form.getItems();
  for (let i = items.length - 1; i >= 0; i--) form.deleteItem(items[i]);

  form.setTitle(titulo)
      .setDescription(descripcion)
      .setCollectEmail(true)
      .setProgressBar(true)
      .setShuffleQuestions(false)
      .setConfirmationMessage('Respuesta registrada correctamente. Gracias por participar en HVAC BDZ Academy.');
  form.setIsQuiz(!!quiz);
  return form;
}

function agregarIdentificacionM2_(form) {
  form.addTextItem().setTitle('Nombre completo').setRequired(true);
  form.addTextItem().setTitle('Empresa / organización').setRequired(true);
  form.addTextItem().setTitle('Puesto o área').setRequired(true);
}

function crearDiagnosticoM2_(ss) {
  const form = prepararFormularioM2_(
    'HVAC_BDZ_M2_DIAG_ID',
    'Evaluación diagnóstica M2 · Cargas térmicas HVAC',
    'Contesta con tus conocimientos actuales, sin buscar en internet ni consultar apuntes. No afecta tu calificación; sirve para identificar el punto de partida antes de iniciar cargas térmicas.',
    false
  );
  agregarIdentificacionM2_(form);

  form.addParagraphTextItem().setTitle('1. ¿Qué entiendes por carga térmica en un espacio?').setRequired(true);
  form.addParagraphTextItem().setTitle('2. Explica con tus palabras la diferencia entre calor sensible y calor latente.').setRequired(true);
  form.addTextItem().setTitle('3. ¿Cuántos BTU/h representa 1 tonelada de refrigeración (1 TR)?').setRequired(true);
  form.addParagraphTextItem().setTitle('4. Menciona los datos que pedirías antes de calcular la carga térmica de una oficina.').setRequired(true);
  form.addParagraphTextItem().setTitle('5. ¿Has realizado antes un cálculo de carga térmica o usado algún software para hacerlo? Describe brevemente tu experiencia.').setRequired(true);

  form.addParagraphTextItem().setTitle('Un cliente dice que su oficina mide 30 m² y pregunta qué capacidad de aire acondicionado necesita. ¿Qué le preguntarías antes de responder?').setRequired(true);
  form.addParagraphTextItem().setTitle('¿Qué factores pueden hacer que dos oficinas con la misma área tengan cargas térmicas diferentes?').setRequired(true);
  form.addParagraphTextItem().setTitle('¿Qué riesgo existe al seleccionar un equipo únicamente por metros cuadrados?').setRequired(true);

  const temas = [
    'Carga sensible, latente y total',
    'Unidades: BTU/h, TR y kW',
    'Orientación y ganancia solar',
    'Personas, iluminación y equipos internos',
    'Ventilación e infiltración',
    'Uso de software de cargas térmicas'
  ];
  temas.forEach(t => form.addScaleItem().setTitle(t).setBounds(1, 5).setLabels('1 - No lo conozco', '5 - Lo domino'));

  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  return form;
}

function crearFormativaM2_(ss) {
  const form = prepararFormularioM2_(
    'HVAC_BDZ_M2_FORM_ID',
    'Actividad formativa M2 · Cargas térmicas HVAC',
    'Actividad de comprensión durante el Módulo 2. Responde antes de continuar con la siguiente parte de la práctica.',
    true
  );
  agregarIdentificacionM2_(form);

  agregarMC_(form, '1. ¿Cuál afirmación describe mejor la carga sensible?',
    ['Cambia principalmente la temperatura', 'Cambia únicamente la humedad', 'Es igual al consumo eléctrico', 'Solo depende del área'],
    'Cambia principalmente la temperatura', 2);

  agregarMC_(form, '2. ¿Cuál afirmación describe mejor la carga latente?',
    ['Está relacionada con cambios de humedad', 'Solo depende de los muros', 'Siempre es cero en oficinas', 'Es lo mismo que kW eléctricos'],
    'Está relacionada con cambios de humedad', 2);

  agregarMC_(form, '3. Un espacio requiere 18,000 BTU/h. ¿A cuántas TR equivale aproximadamente?',
    ['0.5 TR', '1.0 TR', '1.5 TR', '2.0 TR'],
    '1.5 TR', 2);

  agregarMC_(form, '4. ¿Cuál conjunto contiene datos relevantes para una carga térmica?',
    ['Área, altura, orientación, personas, ventanas, iluminación y equipos', 'Solo área y color del muro', 'Solo voltaje y amperaje', 'Solo marca del equipo'],
    'Área, altura, orientación, personas, ventanas, iluminación y equipos', 2);

  form.addParagraphTextItem().setTitle('5. Explica por qué dos espacios del mismo tamaño pueden requerir capacidades diferentes.').setRequired(true);

  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  return form;
}

function crearFinalM2_(ss) {
  const form = prepararFormularioM2_(
    'HVAC_BDZ_M2_FINAL_ID',
    'Evaluación final M2 · Cargas térmicas HVAC',
    'Evaluación final del Módulo 2. Las preguntas objetivas suman 40 puntos.',
    true
  );
  agregarIdentificacionM2_(form);

  agregarMC_(form, '1. ¿Qué es una carga térmica?',
    ['El calor que el sistema debe retirar o aportar para mantener las condiciones de diseño', 'El consumo eléctrico del compresor', 'La cantidad de refrigerante del equipo', 'El peso del aire del local'],
    'El calor que el sistema debe retirar o aportar para mantener las condiciones de diseño', 4);

  agregarMC_(form, '2. ¿Qué representa principalmente una carga sensible?',
    ['Cambio de temperatura', 'Cambio de humedad únicamente', 'Potencia eléctrica', 'Presión de refrigerante'],
    'Cambio de temperatura', 4);

  agregarMC_(form, '3. ¿Qué representa principalmente una carga latente?',
    ['Cambio del contenido de humedad', 'Cambio de voltaje', 'Cambio de área', 'Cambio de marca'],
    'Cambio del contenido de humedad', 4);

  agregarMC_(form, '4. ¿Cuál equivalencia es correcta?',
    ['1 TR = 12,000 BTU/h', '1 TR = 1,200 BTU/h', '1 TR = 3,412 BTU/h', '1 TR = 24,000 BTU/h'],
    '1 TR = 12,000 BTU/h', 4);

  agregarMC_(form, '5. ¿Qué dato puede aumentar la carga interna de una oficina?',
    ['Mayor cantidad de personas y equipos', 'Reducir el horario de uso', 'Eliminar iluminación', 'Disminuir ocupación'],
    'Mayor cantidad de personas y equipos', 4);

  agregarMC_(form, '6. ¿Por qué importa la orientación de una ventana?',
    ['Porque modifica la ganancia solar según la hora', 'Porque cambia el voltaje', 'Porque define el refrigerante', 'Porque sustituye el cálculo de área'],
    'Porque modifica la ganancia solar según la hora', 4);

  agregarMC_(form, '7. ¿Qué debe hacerse antes de aceptar un resultado de software?',
    ['Verificar que los datos capturados tengan sentido técnico', 'Seleccionar el equipo más grande', 'Redondear siempre a la capacidad mayor', 'Ignorar la carga latente'],
    'Verificar que los datos capturados tengan sentido técnico', 4);

  agregarMC_(form, '8. ¿Cuál es el propósito de HVAC BDZ Load dentro del Módulo 2?',
    ['Apoyar el cálculo y la interpretación de la carga térmica', 'Sustituir el levantamiento', 'Diseñar automáticamente toda la instalación sin datos', 'Calcular únicamente consumo eléctrico'],
    'Apoyar el cálculo y la interpretación de la carga térmica', 4);

  agregarMC_(form, '9. ¿Para qué se compara HVAC BDZ Load con LATS Load / LATS HVAC?',
    ['Para revisar supuestos, consistencia e interpretación de resultados', 'Para escoger el programa con el número más alto', 'Para evitar levantar datos', 'Para convertir BTU/h en amperes'],
    'Para revisar supuestos, consistencia e interpretación de resultados', 4);

  agregarMC_(form, '10. ¿Cuál práctica es incorrecta?',
    ['Seleccionar capacidad solo por m² sin revisar uso y condiciones', 'Revisar ocupación y horario', 'Revisar ventanas y orientación', 'Comparar resultados con criterio técnico'],
    'Seleccionar capacidad solo por m² sin revisar uso y condiciones', 4);

  form.addParagraphTextItem().setTitle('Comentario final: ¿qué concepto del Módulo 2 te quedó más claro y cuál necesitas repasar?').setRequired(false);

  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  return form;
}

function crearEncuestaM2_(ss) {
  const form = prepararFormularioM2_(
    'HVAC_BDZ_M2_ENCUESTA_ID',
    'Encuesta de cierre M2 · Cargas térmicas HVAC',
    'Tu opinión nos ayuda a mejorar HVAC BDZ Academy. La encuesta no afecta tu calificación.',
    false
  );
  agregarIdentificacionM2_(form);

  const opciones = ['1 - Deficiente', '2 - Regular', '3 - Bueno', '4 - Muy bueno', '5 - Excelente'];
  ['Claridad del instructor', 'Utilidad del contenido', 'Claridad de la presentación', 'Ritmo de las sesiones'].forEach(t => {
    form.addMultipleChoiceItem().setTitle(t).setChoiceValues(opciones).setRequired(true);
  });
  form.addParagraphTextItem().setTitle('¿Qué tema te gustaría reforzar antes de iniciar el Módulo 3?').setRequired(false);
  form.addParagraphTextItem().setTitle('Comentarios o sugerencias para mejorar el curso.').setRequired(false);

  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  return form;
}

function agregarMC_(form, titulo, opciones, correcta, puntos) {
  const item = form.addMultipleChoiceItem().setTitle(titulo).setRequired(true);
  item.setChoices(opciones.map(op => item.createChoice(op, op === correcta)));
  item.setPoints(puntos);
}

function asegurarEncabezadosM2_(sheet) {
  const encabezados = ['Elemento','Uso','Enlace para participante','Enlace para instructor/respuestas','Enlace edición','Fecha creación'];
  if (sheet.getLastRow() === 0) sheet.getRange(1,1,1,encabezados.length).setValues([encabezados]);
}

function registrarEnlaceM2_(sheet, elemento, uso, form) {
  let fila = -1;
  const last = Math.max(sheet.getLastRow(), 1);
  const vals = sheet.getRange(1,1,last,1).getValues();
  for (let i = 0; i < vals.length; i++) {
    if (vals[i][0] === elemento) { fila = i + 1; break; }
  }
  if (fila < 0) fila = sheet.getLastRow() + 1;
  const edit = form.getEditUrl();
  const analytics = edit.replace(/\/edit$/, '/viewanalytics');
  sheet.getRange(fila,1,1,6).setValues([[
    elemento, uso, form.getPublishedUrl(), analytics, edit, new Date()
  ]]);
}

function crearTableroM2_(ss, forms) {
  let sh = ss.getSheetByName('TABLERO_INSTRUCTOR_M2');
  if (!sh) sh = ss.insertSheet('TABLERO_INSTRUCTOR_M2');
  sh.clear();
  const data = [
    ['HVAC BDZ Academy - Tablero M2',''],
    ['',''],
    ['Curso','HVAC BDZ Academy'],
    ['Módulo','Módulo 2 - Cargas térmicas HVAC'],
    ['Uso','Control de respuestas y evidencias'],
    ['Recomendación','Revisar pestañas de respuestas después de cada actividad'],
    ['Antes de clase','Confirmar diagnóstico contestado'],
    ['Durante módulo','Confirmar actividad formativa'],
    ['Cierre','Confirmar evaluación final y encuesta'],
    ['Hoja maestra', ss.getUrl()]
  ];
  sh.getRange(1,1,data.length,2).setValues(data);
  sh.getRange(1,1,1,2).setFontWeight('bold').setBackground('#0B3C5D').setFontColor('#FFFFFF');
  sh.autoResizeColumns(1,2);
}
