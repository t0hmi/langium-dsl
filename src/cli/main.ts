import type { Model } from '../language/generated/ast.js';
import chalk from 'chalk';
import { Command } from 'commander';
import { TodoListLanguageMetaData } from '../language/generated/module.js';
import { createTodoListServices } from '../language/todo-list-module.js';
import { extractAstNode } from './cli-util.js';
import { generateFile } from './generator.js';
import { NodeFileSystem } from 'langium/node';

export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createTodoListServices(NodeFileSystem).TodoList;
    const model = await extractAstNode<Model>(fileName, services);
    const generatedFilePath = generateFile(model, fileName, opts.destination);
    console.log(chalk.green(`File generated successfully: ${generatedFilePath}`));
};

export type GenerateOptions = {
    destination?: string;
}

export default function(): void {
    const program = new Command();

    program
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        .version("0.0.1");

    const fileExtensions = TodoListLanguageMetaData.fileExtensions.join(', ');
    program
        .command('generate')
        .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
        .option('-d, --destination <dir>', 'destination directory of generating')
        .description('generates JavaScript code that prints "Hello, {name}!" for each greeting in a source file')
        .action(generateAction);

    program.parse(process.argv);
}
