import '../socket.io/socket.io.js'

const issueTemplate = document.querySelector('#issue-template')

if (issueTemplate) {
    const socket = window.io()
    
    socket.on('open', (issue) => {
        appendIssue(issue)
    })
}


function appendIssue (issue) {
    const issueContainer = document.querySelector('.issueContainer')

    const issueNode = issueTemplate.content.cloneNode(true)

    const img = issueNode.querySelector('img')
    const title = issueNode.querySelector('h3')
    const text = issueNode.querySelector('p')
    const form = issueNode.querySelector('form')
    const input = issueNode.querySelector('input')

    img.setAttribute('src', issue.avatar)
    form.setAttribute('action', `./${issue.iid}/close`)
    input.setAttribute('value', issue.iid)

    title.textContent = issue.title
    text.textContent = issue.description

    issueContainer.append(issueNode)
}