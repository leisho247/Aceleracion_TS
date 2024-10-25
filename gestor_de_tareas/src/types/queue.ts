// Interfaz genérica para cualquier tarea
export interface Task<T> {
    id: number;
    type: TaskType;
    data: T;
  }
  
  // Enumeración para los diferentes tipos de tareas
  export enum TaskType {
    Email = "EMAIL",
    FileUpload = "FILE_UPLOAD",
    Notification = "NOTIFICATION"
  }
  
  // Interfaz para los procesadores de tareas, donde la clave es el tipo de tarea
  export interface Processors<T> {
    [key: string]: (task: Task<T>) => void;
  }
  
  
  // Tipos de datos específicos para cada tipo de tarea
  
  // Para tareas de email
  export interface EmailTask {
    recipient: string;
    subject: string;
    body: string;
  }
  
  // Para tareas de subida de archivos
  export interface FileUploadTask {
    fileName: string;
    fileSize: number;
  }
  
  // Para tareas de notificaciones
  export interface NotificationTask {
    title: string;
    message: string;
  }
  