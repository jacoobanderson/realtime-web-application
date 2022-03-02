export class WebhooksController {
    authenticate(req, res, next) {
        if (req.headers['x-gitlab-token'] !== process.env.WEBHOOK_SECRET) {
            const error = new Error('Invalid token')
            error.status = 401
            next(error)
            return
        }
        next()
    }

    hookData(req, res, next) {
        try {
            const data = {
                id: req.body.object_attributes.id,
                iid: req.body.object_attributes.iid,
                title: req.body.object_attributes.title,
                avatar: req.body.user.avatar_url,
                description: req.body.object_attributes.description
            }

        res.status(200).end()

        if (req.body.action === 'open') {
            res.io.emit('open', data)
        } else if (req.body.action === 'close') {
            res.io.emit('close', data)
        } else if (req.body.action === 'reopen') {
            res.io.emit('reopen', data)
        } else if (req.body.action === 'update') {
            res.io.emit('update', data)
        }

        } catch (error) {
            next(error)
        }

    }
}
