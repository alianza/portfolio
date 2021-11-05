function getRepositoryLatestCommitDate(repository) {
    return new Promise((resolve, reject) => {
        fetch(`https://api.github.com/repos/${repository}/commits`)
            .then(response => response.json())
            .then(commits => {
                resolve(commits[0].commit.committer.date)
            })
            .catch(error => {
                reject(error)
            })
    })
}

export default getRepositoryLatestCommitDate;
