import fetch from 'node-fetch'

/**
 *
 */
export class IssuesController {
  /**
   * @param req
   * @param res
   * @param next
   */
  async getIndex (req, res, next) {
    try {
      const issues = await fetch(`https://gitlab.lnu.se/api/v4/projects/${process.env.PROJECT_ID}/issues?state=opened`, {
        headers: {
          authorization: `bearer ${process.env.PERSONAL_ACCESS_TOKEN}`
        }
      })
      const jsonIssues = await issues.json()

      const viewData = {
        issues: jsonIssues.map(issue => ({
          id: issue.id,
          iid: issue.iid,
          title: issue.title,
          avatar: issue.author.avatar_url,
          description: issue.description
        }))
      }
      res.render('issues/index', { viewData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param req
   * @param res
   * @param next
   */
  async closeIssue (req, res, next) {
    try {
      await fetch(`https://gitlab.lnu.se/api/v4/projects/${process.env.PROJECT_ID}/issues/${req.body.iid}?state_event=close`, {
        method: 'PUT',
        headers: {
          authorization: `bearer ${process.env.PERSONAL_ACCESS_TOKEN}`
        }
      })
      res.redirect('..')
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param req
   * @param res
   * @param next
   */
  async getClosedIssues (req, res, next) {
    try {
      const issues = await fetch(`https://gitlab.lnu.se/api/v4/projects/${process.env.PROJECT_ID}/issues?state=closed`, {
        headers: {
          authorization: `bearer ${process.env.PERSONAL_ACCESS_TOKEN}`
        }
      })
      const jsonIssues = await issues.json()

      const viewData = {
        issues: jsonIssues.map(issue => ({
          id: issue.id,
          iid: issue.iid,
          title: issue.title,
          avatar: issue.author.avatar_url,
          description: issue.description
        }))
      }
      res.render('issues/closedIssues', { viewData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param req
   * @param res
   * @param next
   */
  async reOpenIssue (req, res, next) {
    try {
      await fetch(`https://gitlab.lnu.se/api/v4/projects/${process.env.PROJECT_ID}/issues/${req.body.iid}?state_event=reopen`, {
        method: 'PUT',
        headers: {
          authorization: `bearer ${process.env.PERSONAL_ACCESS_TOKEN}`
        }
      })
      console.log(res.statusCode)
      res.redirect('..')
    } catch (error) {
      next(error)
    }
  }
}
