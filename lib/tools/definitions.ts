export const toolDefinitions = [
  {
    type: "function" as const,
    function: {
      name: "get_subjects",
      description: "Obtiene la lista de materias del estudiante.",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_tasks",
      description: "Obtiene la lista de tareas del estudiante, con materia y estado.",
      parameters: {
        type: "object",
        properties: {
          onlyPending: { type: "boolean", description: "Si es true, solo regresa tareas no completadas." },
        },
        required: [],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "create_task",
      description: "Crea una tarea nueva asociada a una materia existente (por nombre).",
      parameters: {
        type: "object",
        properties: {
          subjectName: { type: "string", description: "Nombre de la materia (aproximado está bien)." },
          title: { type: "string" },
          description: { type: "string" },
          dueDate: { type: "string", description: "Formato YYYY-MM-DD." },
        },
        required: ["subjectName", "title", "dueDate"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "toggle_task_completed",
      description: "Marca una tarea como completada o pendiente. Requiere el id, obtenido primero con get_tasks.",
      parameters: {
        type: "object",
        properties: { taskId: { type: "string" } },
        required: ["taskId"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "delete_task",
      description: "Elimina una tarea. Requiere el id, obtenido primero con get_tasks.",
      parameters: {
        type: "object",
        properties: { taskId: { type: "string" } },
        required: ["taskId"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "search_documents",
      description: "Busca en los documentos y apuntes del estudiante mediante búsqueda semántica. Úsala cuando la pregunta pueda responderse con sus materiales de clase.",
      parameters: {
        type: "object",
        properties: { query: { type: "string" } },
        required: ["query"],
      },
    },
  },
    {
    type: "function" as const,
    function: {
      name: "update_task",
      description: "Actualiza el título, descripción o fecha de una tarea existente. Requiere el id, obtenido primero con get_tasks.",
      parameters: {
        type: "object",
        properties: {
          taskId: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          dueDate: { type: "string", description: "Formato YYYY-MM-DD." },
        },
        required: ["taskId"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "update_subject",
      description: "Actualiza el nombre, profesor u horario de una materia existente. Requiere el id, obtenido primero con get_subjects.",
      parameters: {
        type: "object",
        properties: {
          subjectId: { type: "string" },
          name: { type: "string" },
          professor: { type: "string" },
          schedule: { type: "string" },
        },
        required: ["subjectId"],
      },
    },
  },
    {
    type: "function" as const,
    function: {
      name: "create_subject",
      description: "Crea una materia nueva.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string" },
          professor: { type: "string" },
          schedule: { type: "string" },
        },
        required: ["name"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "delete_subject",
      description: "Elimina una materia y todo lo asociado a ella (tareas, documentos vinculados quedan sin materia). Requiere el id, obtenido primero con get_subjects. Si la instrucción es ambigua sobre cuál materia borrar, pide confirmación del nombre exacto antes de proceder.",
      parameters: {
        type: "object",
        properties: { subjectId: { type: "string" } },
        required: ["subjectId"],
      },
    },
  },
];