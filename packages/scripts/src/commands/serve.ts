import {Command} from "commander";
// @ts-ignore
import {serve} from "@js-md-ide/api";
import path from "path";

const isProd = process.env.NODE_ENV === 'production';

export const serveCommand = new Command()
    .command('serve [filename]')
    .description('Open a file for editing')
    .option('-p, --port <number>', 'port to run server on', '4005')
    .action(async (filename = 'notebook.js', options: { port: string }) => {
        try {
            const dir = path.join(process.cwd(), path.dirname(filename))
            await serve(parseInt(options.port), path.basename(filename), dir, !isProd)
            console.log(
                `Opened ${filename}. Navigate to http://localhost:${options.port} to edit the file`
            )
        } catch (e) {
            if (e.code === 'EADDRINUSE')
                console.log(('Port is in use, try running on different Port'))
            else console.log('Here\'s the problem - ', e.message)
            process.exit(1)
        }
    })
