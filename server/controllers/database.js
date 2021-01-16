const Repo = require("../models/repo");
const { gatherIssues } = require("./issue");
const checkEmptyField = require("../utils/checkEmptyField");

const addDataToDB = (req, res) => {
    const repo = new Repo({
        userName: "furkanportakal",
        repoName: "deneme",
    });

    repo.save()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
};

const getAllRepos = async (req, res) => {
    try {
        const allRepos = await Repo.find();
        res.send(allRepos);
    } catch (error) {
        res.send(error);
    }
};
const getSingleDataToDB = (req, res) => {
    Repo.findById("5fde4264f6f6a52c442654c6")
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
};

const addRepo = async (req, res) => {
    const { url } = req.body;
    const checkEmptyArea = checkEmptyField(url);
    if (checkEmptyArea) {
        const parsedURL = url.split("/");
        try {
            if (parsedURL[2] !== "github.com") {
                res.json({
                    result: false,
                    msg: "You need to enter a valid GitHub URL.",
                });
            }
            const projectIssues = await gatherIssues(
                parsedURL[3],
                parsedURL[4]
            );
            if (projectIssues.length === 0) {
                res.json({
                    result: false,
                    msg:
                        "There aren't any issues here, you need to create an issue first.",
                });
            }
            const repo = new Repo({
                userName: parsedURL[3],
                repoName: parsedURL[4],
                issues: projectIssues,
            });
            const repoSave = await repo.save();

            res.json({
                repoSave,
                result: true,
                msg: "registered successfully.",
            });
        } catch (error) {
            console.log(error);
        }
    } else {
        res.json({ result: true, msg: "Fields cannot be empty." });
    }
};

module.exports = { getSingleDataToDB, getAllRepos, addDataToDB, addRepo };
