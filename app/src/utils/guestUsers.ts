


export function createViewedPostsList() {
    if (!localStorage.getItem('viewedPosts')) {
        localStorage.setItem('viewedPosts', JSON.stringify([]))
    }
}

export function addViewedPost(postId: string) {
    const storedList = JSON.parse(localStorage.getItem('viewedPosts') ?? 'null') ?? []
    if (postId) storedList.push(postId)
    localStorage.setItem('viewedPosts', JSON.stringify(storedList))
}

export function getViewedPosts() {
    return JSON.parse(localStorage.getItem('viewedPosts') ?? 'null') ?? []
}

export function alreadyViewed(postId: string) {
    const viewedPosts = getViewedPosts()
    return viewedPosts.includes(postId)
}