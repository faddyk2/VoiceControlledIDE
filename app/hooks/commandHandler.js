let functionStartLine = null;
let functionEndLine = null;
const commands = {
   'run program': (editor,addOutput) => {
    const originalLog = console.log;
    console.log = function(...args) {
    originalLog.apply(console, args);
    const message = args.join(' ');
    addOutput(message);
};
        const code = editor.getValue(); 
        eval(code);
       
        
    },
    'clear everything': (setCode) => {
        setCode('');
    },
    'declare variable': (varName, setCode) => {
        const newVariable = `let ${varName}; `;
        setCode(prevCode => prevCode + newVariable);
    },
    'let': (varName, type, value, setCode,editor) => {
        var selection = editor.getSelection();
        let newVariable;
        if (type === 'string') {
            newVariable = `let ${varName} = '${value}';\n `;
        } else if (type === 'number') {
            newVariable = `let ${varName} = ${value};\n`;
        } else {
            console.log('Unsupported type:', type);
            return;
        }
        var op = {range : selection, text: newVariable};
        editor.executeEdits('my-source', [op]);
        
    },
    'new line': (setCode, editor) => {

        const position = editor.getPosition();
        const lineNumber = position.lineNumber;
        setCode(prevCode => {
            const lines = prevCode.split('\n');
            lines.splice(lineNumber, 0, '');
            return lines.join('\n');
        });
        editor.setPosition({ lineNumber: lineNumber + 1, column: 1 });
    
    },
    'remove current line': (setCode, editor) => {
        const position = editor.getPosition();
        const lineNumber = position.lineNumber;
        setCode(prevCode => {
            const lines = prevCode.split('\n');
            lines[lineNumber - 1] = '';
            return lines.join('\n');
        });
        editor.setPosition({ lineNumber: lineNumber, column: 1 });
    },
    'move up': (setCode, editor) => {
        const position = editor.getPosition();
        if (position.lineNumber > 1) {
            editor.setPosition({ lineNumber: position.lineNumber - 1, column: position.column });
        }
    },
    'move down': (setCode, editor) => {
        const position = editor.getPosition();
        const lineCount = editor.getModel().getLineCount();
        if (position.lineNumber < lineCount) {
            editor.setPosition({ lineNumber: position.lineNumber + 1, column: position.column });
        }
    },
    'add line in block' :(editor) => {
        const position = editor.getPosition();
        const model = editor.getModel();
        const lineContent = model.getLineContent(position.lineNumber).trim();
    
        let openingBraceLine = null;
        let closingBraceLine = null;
    
     
        for (let i = position.lineNumber; i > 0; i--) {
            const content = model.getLineContent(i).trim();
            if (content.endsWith('{')) {
                openingBraceLine = i;
                break;
            }
        }
    
        const lineCount = model.getLineCount();
        for (let i = position.lineNumber; i <= lineCount; i++) {
            const content = model.getLineContent(i).trim();
            if (content === '}') {
                closingBraceLine = i;
                break;
            }
        }
    
        
        if (
            openingBraceLine !== null &&
            closingBraceLine !== null &&
            position.lineNumber > openingBraceLine &&
            position.lineNumber < closingBraceLine
        ) {
            editor.executeEdits('my-source', [
                {
                    range: {
                        startLineNumber: position.lineNumber + 1,
                        startColumn: 1,
                        endLineNumber: position.lineNumber + 1,
                        endColumn: 1,
                    },
                    text: '\n    ', 
                },
            ]);
    
           
            editor.setPosition({ lineNumber: position.lineNumber + 1, column: 5 });
        } else {
            console.log('Cursor is not inside a block.');
        }
    },
    'move outside block' :(editor) => {
        const position = editor.getPosition();
        const model = editor.getModel();
        const lineCount = model.getLineCount();
    
        let targetLine = position.lineNumber;
    
    
        for (let i = position.lineNumber; i <= lineCount; i++) {
            const lineContent = model.getLineContent(i).trim();
            if (lineContent === '}') {
                targetLine = i;
                break;
            }
        }
    
        
        editor.executeEdits('my-source', [
            {
                range: {
                    startLineNumber: targetLine + 1,
                    startColumn: 1,
                    endLineNumber: targetLine + 1,
                    endColumn: 1,
                },
                text: '\n',
            },
        ]);
    
        editor.setPosition({ lineNumber: targetLine + 1, column: 1 });
    },

    

    'delete from': (setCode, editor,from,to) => {
        const fromLine = parseInt(from, 10);
        const toLine = parseInt(to, 10);
        if (isNaN(fromLine) || isNaN(toLine) || fromLine < 1 || toLine < 1) {
            console.log('Invalid line number');
            return;
        }
        const lineCount = editor.getModel().getLineCount();
        if (fromLine > lineCount || toLine > lineCount) {
            console.log('Line number is out of range.');
            return;
        }
        setCode(prevCode => {
            const lines = prevCode.split('\n');
            lines.splice(fromLine - 1, toLine - fromLine + 1);
            return lines.join('\n');
        });

    },
    
    'move cursor sideways' :(direction, editor) => {
        const position = editor.getPosition();
        const newColumn =
            direction === 'left' ? Math.max(position.column - 1, 1) : position.column + 1;
    
        editor.setPosition({ lineNumber: position.lineNumber, column: newColumn });
    },
    'select text': (start, end, editor) => {
        const position = editor.getPosition();
        const range = {
            startLineNumber: position.lineNumber,
            startColumn: start,
            endLineNumber: position.lineNumber,
            endColumn: end,
        };
    
        editor.setSelection(range);
    },
    
   'create function': (funcName, setCode, editor) => {
    var selection = editor.getSelection();
    const position = editor.getPosition().lineNumber;
    const newFunction = `\nfunction ${funcName}() {\n    \n}`;
    var op = {range : selection, text: newFunction};
    editor.executeEdits('my-source', [op]);

    console.log(position);
    setTimeout(() => {
        editor.setPosition({ lineNumber: position+2, column: 5 });
    }, 1000);
    },
    'delete selected text': (editor) => {
        const selection = editor.getSelection();
    
        if (selection) {
            editor.executeEdits('my-source', [
                {
                    range: selection,
                    text: '',
                },
            ]);
        }
    },
    


    'insert text': (text, setCode, editor) => {
        var selection = editor.getSelection(); 
        var op = {range : selection, text: text};
        editor.executeEdits('my-source', [op]);
    },
    'go to text':(text, setCode, editor) => {
       let position =  editor.getModel().findNextMatch(text, {column: 1, lineNumber: 1}, false, false, null, false);

         if(position){
              editor.setPosition(position.range.getStartPosition());
            }
            


    },
    'go to line': (lineNumber, setCode, editor) => {
        const lineNum = parseInt(lineNumber, 10);
        const lineCount = editor.getModel().getLineCount();
        if (!isNaN(lineNum) && lineNum > 0 && lineNum <= lineCount) {
            editor.setPosition({ lineNumber: lineNum, column: 1 });
        } else {
            console.log('Line number is out of range.');
        }
    },
    'print': (setCode, editor,value) => {
        var selection = editor.getSelection();
        var op = {range : selection, text: `console.log(${value});`};
        editor.executeEdits('my-source', [op]);
    },
    'call': (setCode, editor,funcName) => {
        var selection = editor.getSelection();
        const position = editor.getPosition().lineNumber;
        const newFunction = `${funcName}();`;
        var op = {range : selection, text: newFunction};
        editor.executeEdits('my-source', [op]);
    },
    'duplicate line': (editor) => {
        const position = editor.getPosition();
        const model = editor.getModel();
        const lineContent = model.getLineContent(position.lineNumber);

        editor.executeEdits('my-source', [
            {
                range: {
                    startLineNumber: position.lineNumber + 1,
                    startColumn: 1,
                    endLineNumber: position.lineNumber + 1,
                    endColumn: 1,
                },
                text: `${lineContent}\n`,
            },

        ]);
    },
    'jump to line': (lineNumber, editor) => {

    const model = editor.getModel();
    const totalLines = model.getLineCount();

    if (lineNumber > 0 && lineNumber <= totalLines) {
        console.log(`Jumping to line: ${lineNumber}`);

      
        editor.setPosition({ lineNumber, column: 1 });

        
        editor.revealLineInCenter(lineNumber);
    } else {
        console.log(`Invalid line number: ${lineNumber}. Total lines: ${totalLines}`); 
    }
},
    'if else' : (editor) => {
        const position = editor.getPosition();
        editor.executeEdits('my-source', [
            {
                range: {
                    startLineNumber: position.lineNumber,
                    startColumn: 1,
                    endLineNumber: position.lineNumber,
                    endColumn: 1,
                },
                text: 'if (condition) {\n    \n} else {\n    \n}',
            },
        ]);
      
        editor.setPosition({ lineNumber: position.lineNumber + 1, column: 5 });
    },
    'create for loop' : (editor) => {
        const position = editor.getPosition();
        editor.executeEdits('my-source', [
            {
                range: {
                    startLineNumber: position.lineNumber,
                    startColumn: 1,
                    endLineNumber: position.lineNumber,
                    endColumn: 1,
                },
                text: 'for (let i = 0; i < 10; i++) {\n    \n}',
            },
        ]);
   
        editor.setPosition({ lineNumber: position.lineNumber + 1, column: 5 });
    }
    

};


const handleCommand = (transcript, setCode, editor,addOutput) => {

    
    let cleanedTranscript = transcript.trim().toLowerCase();
    console.log(cleanedTranscript);
    cleanedTranscript = cleaner(cleanedTranscript);
    let commandFound = false;

    for (const command in commands) {
        if (cleanedTranscript.startsWith('declare variable ')) {
            const varName = cleanedTranscript.split(' ')[2];
            commands['declare variable'](varName, setCode);
            commandFound = true;
            break;
        }
        if (cleanedTranscript.startsWith('run program')) {
            commands['run program'](editor,addOutput);
            commandFound = true;
            break;
        }
        if(cleanedTranscript.startsWith('delete from')){
            const parts = cleanedTranscript.split(' ');
            const from = parts[2];
            const to = parts[4];
            commands['delete from'](setCode, editor,from,to);
            commandFound = true;
            break;
        }
        if(cleanedTranscript.startsWith('go to text')){
            const text = cleanedTranscript.split(' ').slice(2).join(' ');
            commands['go to text'](text, setCode, editor);
            commandFound = true;
            break;
        }
        if(cleanedTranscript.startsWith('insert text ')){
            const text = cleanedTranscript.split(' ').slice(2).join(' ');
            commands['insert text'](text, setCode, editor);
            commandFound = true;
            break;
        }
        if (cleanedTranscript.startsWith('call')){
            const funcName = cleanedTranscript.split(' ')[1];
            commands['call'](setCode, editor,funcName);
            commandFound = true;
            break;
        }
        if (cleanedTranscript.startsWith('let')) {
            const parts = cleanedTranscript.split(' ');
            const varName = parts[2];
            const type = parts[1];
            const value = parts.slice(3).join(' ');
            commands['let'](varName, type, value, setCode,editor);
            commandFound = true;
            break;
        }
        if (cleanedTranscript.startsWith('create function ')) {
            const funcName = cleanedTranscript.split(' ')[2];
            commands['create function'](funcName, setCode, editor);
            commandFound = true;
            break;
        }
        if (cleanedTranscript.startsWith('print')) {
            let value = cleanedTranscript.split(' ').slice(1).join(' ');

            if (value.includes('string')) {
                value = value.replace('string', '').trim(); 
                value = `'${value}'`; 
            }
            commands['print'](setCode, editor, value);
            commandFound = true;
            break;
        }
        if (cleanedTranscript.startsWith('add line in function')) {
            commands['add line in function'](editor);
            commandFound = true;
            break;
        }
        
        if (cleanedTranscript.startsWith('move outside function')) {
            commands['move outside function'](editor);
            commandFound = true;
            break;
        }
        if (cleanedTranscript.startsWith('duplicate line')) {
            commands['duplicate line'](editor);
            commandFound = true;
            break;
        }
        if (cleanedTranscript.startsWith('if else')) {
            commands['if else'](editor);
            commandFound = true;
            break;
        }
        if (cleanedTranscript.startsWith('create for loop')) {
            commands['create for loop'](editor);
            commandFound = true;
            break;
        }
        if (cleanedTranscript.startsWith('delete selected text')) {
            commands['delete selected text'](editor);
            commandFound = true;
            break;
        }
        if (cleanedTranscript.startsWith('move cursor')) {
            const direction = cleanedTranscript.includes('left') ? 'left' : 'right';
            commands['move cursor sideways'](direction, editor);
            commandFound = true;
            break;
        }
        if (cleanedTranscript.startsWith('select text from')) {
            const parts = cleanedTranscript.split(' ');
            const start = parseInt(parts[3], 10);
            const end = parseInt(parts[5], 10);
        
            if (!isNaN(start) && !isNaN(end)) {
                commands['select text'](start, end, editor);
                commandFound = true;

            }
            break;
        }
        if (cleanedTranscript.startsWith('add line in block')) {
            commands['add line in block'](editor);
            commandFound = true;
            break;
        }
        
        if (cleanedTranscript.startsWith('move outside block')) {
            commands['move outside block'](editor);
            commandFound = true;
            break;
        }
        
        if (cleanedTranscript.startsWith('jump to line')) {
            // Extract line number using regex
            const match = cleanedTranscript.match(/jump to line (\d+)/);
        
            if (match) {
                const lineNumber = parseInt(match[1], 10);
                console.log(`Parsed line number: ${lineNumber}`); // Debug log
        
                if (!isNaN(lineNumber)) {
                    commands['jump to line'](lineNumber, editor);
                } else {
                    console.log('Error: Invalid line number specified.');
                }
            } else {
                console.log('Error: Invalid command or missing line number.');
            }
        }
        


        
        const commandRegex = new RegExp(`^${command} (\\d+)$`);
        const match = cleanedTranscript.match(commandRegex);
        if (match) {
            const lineNumber = match[1];
            commands[command](lineNumber, setCode, editor);
            commandFound = true;
            break;
        }
        if (cleanedTranscript.includes(command)) {
            commands[command](setCode, editor);
            commandFound = true;
            break;
        }
       
    
        if (commandFound) {
            addOutput('Command executed successfully.');
        } else {
            addOutput('Command not recognized.');
        }
    
    
    }

    if (!commandFound) {
        console.log('Command not recognized');
    }
    return commandFound;
};

export default handleCommand;

function cleaner(transcript){
    if(transcript.includes('why') && transcript.includes('let')){
        console.log('why');
        transcript = transcript.replace('why','y');
    }
    if(transcript.includes('minus')){
        transcript = transcript.replace('minus','-');
    }
    return transcript;
}

