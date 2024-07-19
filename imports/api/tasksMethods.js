import { check } from 'meteor/check';
import { TasksCollection } from "../db/TasksCollection";
 
Meteor.methods({
  'tasks.insert'(text) {
    check(text, String);
 
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }
 
    TasksCollection.insertAsync({
      text,
      createdAt: new Date,
      userId: this.userId,
    })
  },
 
'tasks.remove': async (taskId) => {
    check(taskId, String);

    if (!Meteor.userId()) {
      throw new Meteor.Error('Not authorized.');
    }

    const task = await TasksCollection.findOneAsync({ _id: taskId, userId: Meteor.userId() });

    if (!task) {
      throw new Meteor.Error('Access denied.');
    }

    TasksCollection.removeAsync(taskId);
  },

  'tasks.setIsChecked': async(taskId, isChecked) =>{
    check(taskId, String);
    check(isChecked, Boolean);

    if (!Meteor.userId()) {
      throw new Meteor.Error('Not authorized.');
    }

    const task = await TasksCollection.findOneAsync({ _id: taskId, userId: Meteor.userId() });

    if (!task) {
      throw new Meteor.Error('Access denied.');
    }

    TasksCollection.updateAsync(taskId, {
      $set: {
        isChecked,
      },
    });
  },
});