import '../socket.io/socket.io.js'

const issueTemplate = document.querySelector('#issue-template')

if (issueTemplate) {
  const socket = window.io()

  socket.on('openIssue', (issue) => {
    appendIssue(issue)
  })
  socket.on('closeIssue', (issue) => {
    const issueDiv = document.getElementById(issue.id)
    if (issueDiv) {
      issueDiv.remove()
    }
  })
  socket.on('reopenIssue', (issue) => {
    const issueDiv = document.getElementById(issue.id)
    if (!issueDiv) {
      appendIssue(issue)
    }
  })
  socket.on('updateIssue', (issue) => {
    const issueDiv = document.getElementById(issue.id)
    if (issueDiv) {
      issueDiv.remove()
      appendIssue(issue)
    }
  })
}

/**
 * Creates a new issue and appends it to the issuecontainer.
 *
 * @param {object} issue - Object of an issue containing data.
 */
function appendIssue (issue) {
  const issueContainer = document.querySelector('.issueContainer')

  const issueNode = issueTemplate.content.cloneNode(true)

  const issueDiv = issueNode.querySelector('.issue')
  const img = issueNode.querySelector('img')
  const title = issueNode.querySelector('h3')
  const text = issueNode.querySelector('p')
  const form = issueNode.querySelector('form')
  const input = issueNode.querySelector('input')

  img.setAttribute('src', issue.avatar)
  form.setAttribute('action', `./${issue.iid}/close`)
  input.setAttribute('value', issue.iid)
  issueDiv.setAttribute('id', issue.id)

  title.textContent = issue.title
  text.textContent = issue.description

  issueContainer.append(issueNode)
}
