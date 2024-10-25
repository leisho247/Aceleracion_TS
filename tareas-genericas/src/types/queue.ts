
 export  enum TaskType{
    Email = 'email',
    Todo = 'todo',
    Notification = 'notification',
    Report = 'report'
}

 export  interface Task<T> {
    id: number;
    type: string;
    data: T;
  }
  
  
  // Ejemplo de tarea (para la resolución generar otros tipos de tareas)
   export  interface EmailTask {
      recipient: string;
      subject: string;
      body: string;
    }

    export interface TodoTask{
        title: string;
        description: string;
        priority: number;
    }

     export  interface NotificationTask {
        title: string;
        description: string;
        data: Date;
    }

     export  interface ReportTask {
        title: string;
        description: string;
    }


   export type Processors<T> = Record<string, (task: Task<T>)=> void>;

