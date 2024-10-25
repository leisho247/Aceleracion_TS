import type {
            TodoTask,
            ReportTask,
            NotificationTask,
            EmailTask,
            Task,
            Processors
           }from 'src/types/queue';
import {TaskType} from 'src/types/queue' 



class TaskQueue<T> {
   private tasks: Task<T>[] = [];
   private processors: Processors<T> = {};
   private id = 1;

   constructor(processors: Processors<T>) {
    this.processors = processors;
   }

   addTask(type: TaskType, data: T):string {
    const newTaskId = this.id++;
    this.tasks.push({ id: newTaskId, type, data});
    return `se agrego la tarea con el id ${newTaskId} de tipo ${type}`
   } 
       

   cancelTask(id: number): string{
    const index = this.tasks.findIndex((tasks) => tasks.id === id)

    if(index === -1){
        return `no se encontro la tarea con el id ${id}`
    }
    this.tasks.splice(index, 1);
    return `se cancelo la tarea con el id ${id}`

   }

   proccesAllTask(): void {
    console.log('se estan procesando todas las tareas')
    this.tasks.forEach((task)=>{
        this.proccesTask(task)
    })
    this.id = 1;
    console.log('se procesaron todas las tareas')
   }

   private proccesTask(task: Task<T>): void {
        const processor = this.processors[task.type] || this.processors.default;
        processor(task);
        this.tasks = this.tasks.filter((t) => t.id !== task.id);
   }

   // retorna el array
   getAllTasks(): Task<T>[]{
    return this.tasks
   } 



  }
export default function queueManager() {
    console.log('***************** queueManager *********************')
    
    const emailProcessor = (task: Task<EmailTask>):void => {
        console.log(`Enviando email a ${task.data.recipient}`);
      };
      const reportProcessor = (task: Task<ReportTask>): void => {
        console.log(`Generando reporte para ${task.data.title}`);
      };
      const todoProcessor = (task: Task<TodoTask>): void => {
        console.log(`Agregando tarea ${task.data.title}`);
      };
      const notificationProcessor = (task: Task<NotificationTask>): void => {
        console.log(`Enviando notificación a ${task.data.title}`);
      };
    
      const processor: Processors<EmailTask | TodoTask| ReportTask| NotificationTask> = {
        [TaskType.Email]: emailProcessor,
        [TaskType.Todo]: todoProcessor,
        [TaskType.Report]: reportProcessor,
        [TaskType.Notification]: notificationProcessor,
        default: (task: Task<any>) => {
          console.log(`Procesando tarea de tipo desconocido: ${task.type}`);
        },
      };
        
      const queue = new TaskQueue(processor);

     const taskAddResult1 = queue.addTask(TaskType.Email, { 
        recipient: 'user123@example.com',
        subject: 'Hola', 
        body: 'hello..' });
      console.log(taskAddResult1);

      const taskAddResult2 = queue.addTask(TaskType.Report, {
        title: 'Reporte mensual',
        description: 'Reporte mensual de ventas',
      });
      console.log(taskAddResult2);

      const taskAddResult3 = queue.addTask(TaskType.Todo, {
        title: 'Tarea 1',
        description: 'Descripción de la tarea 1',
        priority: 1,
      });
      console.log(taskAddResult3);

      const taskAddResult4 = queue.addTask(TaskType.Notification, {
        title: 'Notificación 1',
        description: 'Descripción de la notificación 1',
        data: new Date(),
      });
      console.log(taskAddResult4);
      
      queue.proccesAllTask();

      const allTaskResult1 = queue.getAllTasks();
      console.log(allTaskResult1);

      const taskAddResult5 = queue.addTask(TaskType.Email, { 
        recipient: 'user123@example.com',
        subject: 'Hola', 
        body: 'hello..' });
      console.log(taskAddResult5);

      const allTaskResult2 = queue.getAllTasks();
      console.log(allTaskResult2);

      const taskCancelResult1 = queue.cancelTask(2);
      const taskCancelResult2 = queue.cancelTask(1);

      console.log(taskCancelResult1);
      console.log(taskCancelResult2);

      const allTaskResult3 = queue.getAllTasks();
      console.log(allTaskResult3);
    console.log('***************** queueManager *********************')
}