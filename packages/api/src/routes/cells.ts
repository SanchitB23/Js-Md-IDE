import express from "express";
import fs from "fs/promises";
import path from "path";

interface Cell {
    id: string;
    content: string;
    type: 'code' | 'markdown'
}

export const createCellsRouter = (filename: string, dir: string) => {
    const router = express.Router()
    router.use(express.json())

    const fullPath = path.join(dir, filename)

    router.get('/cells', async (req, res) => {
        console.log("Fetching Cells Start")
        try {
            const result = await fs.readFile(fullPath, {encoding: "utf-8"})
            res.status(200).send(JSON.parse(result))

        } catch (e) {
            if (e.code === 'ENOENT') {
                await fs.writeFile(fullPath, '[]', "utf-8")
                res.sendStatus(204)
            } else {
                throw e
            }
        }
    })

    router.post('/cells', async (req, res) => {
        const {data}: { data: Cell[] } = req.body
        console.log("Saving Data start", data, "ANythign?", req.body.data)
        try {
            await fs.writeFile(fullPath, JSON.stringify(data), "utf-8")
            res.sendStatus(200)
        } catch (e) {
            console.log("Error on saving", e.message)
            res.status(e.code).send(e.message)
        } finally {
            console.log("Saving Post completed somehow")
        }
    })

    return router
}
