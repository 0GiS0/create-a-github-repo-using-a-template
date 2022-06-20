const { Octokit } = require("octokit");
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });


module.exports = async function(context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // Get the variables from the body of the request
    let repoOwner = req.body.repoOwner;
    let repoName = req.body.repoName;
    let templateName = req.body.templateName;
    let templateOwner = req.body.templateOwner;

    const {
        data: { login },
    } = await octokit.rest.users.getAuthenticated();

    // Create the repository using a template

    try {
        const { data } = await octokit.rest.repos.createUsingTemplate({
            owner: repoOwner,
            name: repoName.replace(' ', '-'),
            template_owner: templateOwner,
            template_repo: templateName,
            private: true,
            include_all_branches: true
        });

        context.res = {
            // status: 200, /* Defaults to 200 */
            body: data
        };

    } catch (error) {
        console.log('ERROR!!');
        console.log(error);

        context.res = {
            status: 500,
            body: error
        };
    }
}