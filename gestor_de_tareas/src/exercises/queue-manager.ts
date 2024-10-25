import { Task, TaskType, Processors, EmailTask, FileUploadTask, NotificationTask } from 'src/types/queue';

class TaskQueue<T> {
  private tasks: Task<T>[] = [];
  private processors: Processors<T>;
  private id = 1;

  constructor(processors: Processors<T>) {
    this.processors = processors;
  }

  // Agregar una nueva tarea a la cola
  addTask(type: TaskType, data: T): string {
    const newTaskId = this.id++;
    this.tasks.push({ id: newTaskId, type, data });
    return `Tarea con ID ${newTaskId} y tipo ${type} ha sido agregada.`;
  }

  // Cancelar una tarea de la cola
  cancelTask(id: number): string {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) {
      return `No se encontró la tarea con ID ${id}.`;
    }
    this.tasks.splice(index, 1);
    return `Tarea con ID ${id} ha sido cancelada.`;
  }

  // Procesar todas las tareas en la cola
  processAllTasks(): void {
    console.log("Procesando todas las tareas...");
    this.tasks.forEach(task => this.processTask(task));
    this.tasks = []; // Limpiar la cola una vez procesadas todas las tareas
    console.log("Todas las tareas han sido procesadas.");
  }

  // Procesar una tarea individual
  private processTask(task: Task<T>): void {
    const processor = this.processors[task.type] || this.processors.default;
    processor(task);
  }

  // Obtener todas las tareas pendientes en la cola
  getAllTasks(): Task<T>[] {
    return this.tasks;
  }
}

// Función para gestionar la cola de tareas
export default function queueManager() {
  console.log('***************** queueManager *********************');

  // Definir procesadores para cada tipo de tarea
  const emailProcessor = (task: Task<EmailTask>): void => {
    console.log(`Enviando email a ${task.data.recipient} con asunto "${task.data.subject}".`);
  };

  const fileUploadProcessor = (task: Task<FileUploadTask>): void => {
    console.log(`Subiendo archivo "${task.data.fileName}" de tamaño ${task.data.fileSize}MB.`);
  };

  const notificationProcessor = (task: Task<NotificationTask>): void => {
    console.log(`Mostrando notificación: ${task.data.title} - ${task.data.message}`);
  };

  // Configuración de procesadores
  const processors: Processors<EmailTask | FileUploadTask | NotificationTask> = {
    [TaskType.Email]: emailProcessor,
    [TaskType.FileUpload]: fileUploadProcessor,
    [TaskType.Notification]: notificationProcessor,
    default: (task: Task<any>) => {
      console.log(`Procesando tarea de tipo desconocido: ${task.type}`);
    }
  };

  // Crear la cola de tareas
  const queue = new TaskQueue(processors);

  // Agregar algunas tareas de ejemplo
  const taskAddResult1 = queue.addTask(TaskType.Email, {
    recipient: 'carlos123@gmail.com',
    subject: 'Bienvenido',
    body: 'Hola, bienvenido a nuestro sistema.'
  });
  console.log(taskAddResult1);

  const taskAddResult2 = queue.addTask(TaskType.FileUpload, {
    fileName: 'document.pdf',
    fileSize: 4
  });
  console.log(taskAddResult2);

  const taskAddResult3 = queue.addTask(TaskType.Notification, {
    title: 'Actualización',
    message: 'Se ha lanzado una nueva versión del sistema.'
  });
  console.log(taskAddResult3);

  // Procesar todas las tareas
  queue.processAllTasks();

  // Verificar tareas pendientes (debería estar vacío)
  const allTasks = queue.getAllTasks();
  console.log(allTasks);


  const taskAddResult5 = queue.addTask(TaskType.Email, {
    recipient: 'coco@gmail.com',
    subject: 'hello',
    body: 'Hola, bienvenido a nuestro sistema.'
  });
  console.log(taskAddResult5);
  
  
  console.log('***************** queueManager *********************');
}
