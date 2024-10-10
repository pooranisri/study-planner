/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

let tasks = []; // Store tasks outside beforeEach to persist across tests

describe('Study Planner App', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
        tasks = []; // Reset tasks before each test if needed

         // Mock Date for consistent deadline testing
        const mockDate = new Date('2024-12-25T12:00:00'); // Example date
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    });


    //Test cases

    it('should display the planner section', () => {
      const plannerDiv = document.getElementById('planner');
      expect(plannerDiv).toBeInTheDocument();
    });
  
    it('should add a new task', () => {
      const taskNameInput = document.getElementById('task-name');
      const taskPrioritySelect = document.getElementById('task-priority');
      const taskDeadlineInput = document.getElementById('task-deadline');
      const addTaskButton = document.querySelector('button[onclick="addTask()"]');
    
      taskNameInput.value = 'Test Task';
      taskPrioritySelect.value = 'high';
      taskDeadlineInput.value = '2025-01-15';
      addTaskButton.click();

      const taskDivs = document.querySelectorAll('.task');
      expect(taskDivs.length).toBe(1);

      const newTaskDiv = taskDivs[0];
      expect(newTaskDiv.querySelector('h3').textContent).toBe('Test Task');
      expect(newTaskDiv.querySelector('p').textContent).toBe('Deadline: 2025-01-15');
      expect(newTaskDiv.classList.contains('priority-high')).toBe(true);
      expect(newTaskDiv.querySelector('input[type="checkbox"]')).toBeInTheDocument(); // Check if checkbox exists
      
    });
  
    describe("Task completion and removal", () => {
        beforeEach(() => {
          addTask("Test Task", "high", "2025-01-15"); // Add a test task for these tests
        });
      
        it('should mark a task as complete', () => {
          const checkbox = document.querySelector('input[type="checkbox"]');
          checkbox.click();
          expect(checkbox.checked).toBe(true); // Checkbox is checked
          const taskDiv = document.querySelector('.task');
          expect(taskDiv.classList.contains('completed')).toBe(true);
        });
    });

    it('should set reminders based on deadline (mocked date)', () => {
        jest.useFakeTimers();  // Essential for testing setTimeout

        addTask("Task with Reminder", "medium", "2024-12-26"); // Deadline is tomorrow based on mocked date
    
        jest.runAllTimers(); // Execute the setTimeout callbacks
    
        expect(setTimeout).toHaveBeenCalledTimes(1); // Assuming only one timeout for the reminder
        
        // This test is tricky because we've mocked the Date.  A better, but more complex, approach
        // would be to spy on setTimeout and check the delay it was called with.
      });

    
    // Helper function to simulate adding a task (keeps tests DRY)
    function addTask(name, priority, deadline) {
      document.getElementById('task-name').value = name;
      document.getElementById('task-priority').value = priority;
      document.getElementById('task-deadline').value = deadline;
      document.querySelector('button[onclick="addTask()"]').click();
    }

});