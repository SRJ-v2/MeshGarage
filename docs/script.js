const OWNER = "SRJ-v2";
const REPO = "MeshGarage";


const API_URL =
    `https://api.github.com/repos/${OWNER}/${REPO}/releases?per_page=100`;



async function loadMeshGarageRelease() {

    try {


        const response = await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                `GitHub API returned ${response.status}`
            );

        }


        const releases = await response.json();



        if (!Array.isArray(releases) || releases.length === 0) {

            throw new Error(
                "No releases found"
            );

        }



        /* ----------------------------------------
           Find newest published release
        ---------------------------------------- */

        const latestRelease =
            releases.find(
                release =>
                    !release.draft
            );


        if (!latestRelease) {

            throw new Error(
                "No published releases found"
            );

        }



        /* ----------------------------------------
           Find installer and portable builds
        ---------------------------------------- */

        const installer =
            latestRelease.assets.find(
                asset =>
                    /setup.*\.exe$/i.test(asset.name)
            );


        const portable =
            latestRelease.assets.find(
                asset =>
                    /portable.*\.zip$/i.test(asset.name)
            );



        /* ----------------------------------------
           Set latest version
        ---------------------------------------- */

        const versionElement =
            document.getElementById("version");


        versionElement.textContent =
            latestRelease.name ||
            latestRelease.tag_name;



        /* ----------------------------------------
           Set installer URLs
        ---------------------------------------- */

        if (installer) {

            setDownloadButton(
                "installer-download",
                installer.browser_download_url
            );


            setDownloadButton(
                "installer-download-bottom",
                installer.browser_download_url
            );

        }



        /* ----------------------------------------
           Set portable URLs
        ---------------------------------------- */

        if (portable) {

            setDownloadButton(
                "portable-download",
                portable.browser_download_url
            );


            setDownloadButton(
                "portable-download-bottom",
                portable.browser_download_url
            );

        }



        /* ----------------------------------------
           Count downloads of MeshGarage builds
           across ALL releases
        ---------------------------------------- */

        let totalDownloads = 0;


        releases.forEach(release => {


            if (release.draft) {

                return;

            }


            release.assets.forEach(asset => {


                const isInstaller =
                    /setup.*\.exe$/i.test(
                        asset.name
                    );


                const isPortable =
                    /portable.*\.zip$/i.test(
                        asset.name
                    );


                if (isInstaller || isPortable) {

                    totalDownloads +=
                        asset.download_count || 0;

                }


            });


        });



        document.getElementById(
            "download-count"
        ).textContent =
            totalDownloads.toLocaleString();


    }
    catch (error) {


        console.error(
            "Unable to load MeshGarage release:",
            error
        );


        document.getElementById(
            "version"
        ).textContent =
            "Beta";


        document.getElementById(
            "download-count"
        ).textContent =
            "—";


    }

}



/* ----------------------------------------
   Enable download button
---------------------------------------- */

function setDownloadButton(
    elementId,
    downloadUrl
) {


    const element =
        document.getElementById(
            elementId
        );


    if (!element) {

        return;

    }


    element.href =
        downloadUrl;


    element.classList.remove(
        "disabled"
    );


}



/* ----------------------------------------
   Start
---------------------------------------- */

loadMeshGarageRelease();
