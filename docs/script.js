const OWNER = "SRJ-v2";
const REPO = "MeshGarage";

const API =
    `https://api.github.com/repos/${OWNER}/${REPO}/releases?per_page=100`;

async function loadReleaseData() {

    try {

        const response = await fetch(API);

        if (!response.ok) {
            throw new Error(`GitHub API: ${response.status}`);
        }

        const releases = await response.json();

        if (!releases.length) {
            return;
        }


        // -------------------------
        // Total downloads
        // -------------------------

        let totalDownloads = 0;

        for (const release of releases) {

            for (const asset of release.assets) {

                totalDownloads += asset.download_count;
            }

        }

        document.getElementById("download-count").textContent =
            totalDownloads.toLocaleString();


        // -------------------------
        // Newest published release
        // -------------------------

        const latestRelease = releases[0];

        document.getElementById("version").textContent =
            latestRelease.name || latestRelease.tag_name;


        // -------------------------
        // Find installer
        // -------------------------

        const installer =
            latestRelease.assets.find(asset =>
                /setup.*\.exe$/i.test(asset.name)
            );


        // -------------------------
        // Find portable
        // -------------------------

        const portable =
            latestRelease.assets.find(asset =>
                /portable.*\.zip$/i.test(asset.name)
            );


        if (installer) {

            document.getElementById(
                "installer-download"
            ).href = installer.browser_download_url;

        }


        if (portable) {

            document.getElementById(
                "portable-download"
            ).href = portable.browser_download_url;

        }

    }
    catch (error) {

        console.error(
            "Unable to load GitHub release information:",
            error
        );

        document.getElementById(
            "download-count"
        ).textContent = "—";

    }

}

loadReleaseData();
