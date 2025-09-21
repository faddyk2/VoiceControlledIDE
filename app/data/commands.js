// Comprehensive list of voice commands organized by category
export const commandCategories = {
  "Program Control": {
    icon: "🏃",
    description: "Commands to control program execution",
    commands: [
      {
        command: "run program",
        description: "Execute the code in the editor",
        example: "run program",
        syntax: "run program"
      },
      {
        command: "clear everything",
        description: "Clear all content from the editor",
        example: "clear everything",
        syntax: "clear everything"
      }
    ]
  },
  "Variables": {
    icon: "📦",
    description: "Commands to work with variables",
    commands: [
      {
        command: "declare variable",
        description: "Declare a new variable",
        example: "declare variable myVar",
        syntax: "declare variable [name]"
      },
      {
        command: "let string",
        description: "Create a string variable",
        example: "let string myName Hello World",
        syntax: "let string [name] [value]"
      },
      {
        command: "let number",
        description: "Create a number variable",
        example: "let number age 25",
        syntax: "let number [name] [value]"
      }
    ]
  },
  "Functions": {
    icon: "⚙️",
    description: "Commands to create and manage functions",
    commands: [
      {
        command: "create function",
        description: "Create a new function",
        example: "create function myFunction",
        syntax: "create function [name]"
      },
      {
        command: "create function with parameters",
        description: "Create a function with parameters",
        example: "create function with parameters myFunc param1 param2",
        syntax: "create function with parameters [name] [param1] [param2] ..."
      },
      {
        command: "call",
        description: "Call a function",
        example: "call myFunction",
        syntax: "call [functionName]"
      },
      {
        command: "call function with arguments",
        description: "Call a function with arguments",
        example: "call function with arguments myFunc hello 42",
        syntax: "call function with arguments [name] [arg1] [arg2] ..."
      }
    ]
  },
  "Text Operations": {
    icon: "📝",
    description: "Commands for text manipulation",
    commands: [
      {
        command: "insert text",
        description: "Insert text at cursor position",
        example: "insert text Hello World",
        syntax: "insert text [content]"
      },
      {
        command: "print",
        description: "Add console.log statement",
        example: "print Hello World",
        syntax: "print [value]"
      },
      {
        command: "print string",
        description: "Print a string literal",
        example: "print string Hello World",
        syntax: "print string [text]"
      },
      {
        command: "go to text",
        description: "Navigate to specific text",
        example: "go to text function",
        syntax: "go to text [searchText]"
      }
    ]
  },
  "Navigation": {
    icon: "🧭",
    description: "Commands for cursor and editor navigation",
    commands: [
      {
        command: "move up",
        description: "Move cursor up one line",
        example: "move up",
        syntax: "move up"
      },
      {
        command: "move down",
        description: "Move cursor down one line",
        example: "move down",
        syntax: "move down"
      },
      {
        command: "go to line",
        description: "Jump to a specific line number",
        example: "go to line 5",
        syntax: "go to line [number]"
      },
      {
        command: "jump to line",
        description: "Jump to line with highlighting",
        example: "jump to line 10",
        syntax: "jump to line [number]"
      },
      {
        command: "move cursor",
        description: "Move cursor left or right",
        example: "move cursor left",
        syntax: "move cursor [left|right]"
      }
    ]
  },
  "Code Structures": {
    icon: "🏗️",
    description: "Commands to create code structures",
    commands: [
      {
        command: "if",
        description: "Create if-else statement",
        example: "if x is greater than 5",
        syntax: "if [condition]"
      },
      {
        command: "create for loop",
        description: "Create a for loop",
        example: "create for loop",
        syntax: "create for loop"
      },
      {
        command: "create switch statement",
        description: "Create switch statement with cases",
        example: "create switch statement myVar case1 case2",
        syntax: "create switch statement [variable] [case1] [case2] ..."
      }
    ]
  },
  "Editor Operations": {
    icon: "✂️",
    description: "Commands for editing operations",
    commands: [
      {
        command: "duplicate line",
        description: "Duplicate the current line",
        example: "duplicate line",
        syntax: "duplicate line"
      },
      {
        command: "delete selected text",
        description: "Delete currently selected text",
        example: "delete selected text",
        syntax: "delete selected text"
      },
      {
        command: "select text from",
        description: "Select text between positions",
        example: "select text from 1 to 10",
        syntax: "select text from [start] to [end]"
      },
      {
        command: "delete from",
        description: "Delete lines in range",
        example: "delete from 5 to 10",
        syntax: "delete from [startLine] to [endLine]"
      },
      {
        command: "remove current line",
        description: "Remove the current line",
        example: "remove current line",
        syntax: "remove current line"
      },
      {
        command: "new line",
        description: "Insert a new line",
        example: "new line",
        syntax: "new line"
      }
    ]
  },
  "Block Operations": {
    icon: "🧱",
    description: "Commands for working with code blocks",
    commands: [
      {
        command: "add line in block",
        description: "Add line inside a code block",
        example: "add line in block",
        syntax: "add line in block"
      },
      {
        command: "move outside block",
        description: "Move cursor outside current block",
        example: "move outside block",
        syntax: "move outside block"
      },
      {
        command: "add line in function",
        description: "Add line inside a function (alias)",
        example: "add line in function",
        syntax: "add line in function"
      },
      {
        command: "move outside function",
        description: "Move cursor outside function (alias)",
        example: "move outside function",
        syntax: "move outside function"
      }
    ]
  },
  "AI Assistant": {
    icon: "🤖",
    description: "AI-powered coding assistance",
    commands: [
      {
        command: "assist",
        description: "Get AI help with code",
        example: "assist create a function that calculates factorial",
        syntax: "assist [your request]"
      }
    ]
  }
};

// Flatten all commands for search functionality
export const allCommands = Object.values(commandCategories)
  .flatMap(category => 
    category.commands.map(cmd => ({
      ...cmd,
      category: Object.keys(commandCategories).find(key => 
        commandCategories[key].commands.includes(cmd)
      )
    }))
  );

// Quick help tips
export const helpTips = [
  "💡 Speak clearly and at normal pace for best recognition",
  "🎯 Use exact command syntax for better accuracy",
  "🔄 Check the terminal for command confirmation",
  "📋 Copy command examples to test them",
  "🔍 Use the search to find specific commands quickly"
];