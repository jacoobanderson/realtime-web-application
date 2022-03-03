import fetch from 'node-fetch'

/**
 * Encapsulates the issue controller.
 */
export class IssuesController {
  /**
   * Renders the index.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
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
   * Closes an issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
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
   * Renders all the closed issues.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
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
   * Reopens the issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
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
