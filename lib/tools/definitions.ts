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
];