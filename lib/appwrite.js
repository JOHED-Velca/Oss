// import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';

//create and export a new appwriteConfig object
export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.johed.aora',
    projectId: '683f6817000fd5b6b4c9',
    databaseId:'683f6a9f001b8afbc4b8',
    userCollectionId: '683f6af10034313dedba',
    videoCollectionId: '683f6b2b001e15e8ecaa',
    storageId: '683f6cba0005034c6ae7'
}

//this allows us to expose them outside the object
const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId,
} = config;


// Init your React Native SDK
// const client = new Client();

// client
//     .setEndpoint(config.endpoint)
//     .setProject(config.projectId)
//     .setPlatform(config.platform)
// ;

// const account = new Account(client);
// const avatars = new Avatars(client);
// const databases = new Databases(client);
// const storage = new Storage(client);

// Register User
export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username)

        await signIn(email, password);

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )

        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);        
    }
}

export const signIn = async (email, password) => {
    // try {
    //     const session = await account.createEmailPasswordSession(email, password);

    //     return session;
    // } catch (error) {
    //     console.log(error);
    //     throw new Error(error);
    // }

    try {
        // Log out any existing session
        try {
            await account.deleteSession('current');
        } catch (logoutError) {
            // Ignore if no session exists
        }

        const session = await account.createEmailPasswordSession(email, password);
        if (!session) throw new Error('Session creation failed');
        return session;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentAccount) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        
    }
}

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt')]
        )

        return posts.documents;
    } catch (error) {
        console.log(error);
        throw new Error(error);
        
    }
}

export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt'), Query.limit(7)]
        )

        return posts.documents;
    } catch (error) {
        console.log(error);
        throw new Error(error);
        
    }
}

export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search('title', query)]
        )

        return posts.documents;
    } catch (error) {
        console.log(error);
        throw new Error(error);
        
    }
}

export const getUserPosts = async (userId) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal('creator', userId)]
        )

        return posts.documents;
    } catch (error) {
        console.log(error);
        throw new Error(error);
        
    }
}

export const signOut = async () => {
    try {
        const session = await account.deleteSession('current');

        return session;
        
    } catch (error) {
        throw new Error(error);
        
    }
}

export const getFilePreview = async (fileId, type) => {
    let fileUrl;

    try {
        if (type === 'video') {
            fileUrl = storage.getFileView(storageId, fileId)
        } else if(type === 'image') {
            fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, 'top', 100);
        } else {
            throw new Error('Invalid file type');
        }

        if (!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

export const uploadFile = async (file, type) => {
  if (!file) return;
  console.log("Upload attempt for", type, "file:", file.uri);

  try {
    // Defensive check for file URI
    if (!file.uri) throw new Error(`No URI found for ${type} file`);
    
    // Generate a unique ID before uploading
    const fileId = ID.unique();
    console.log(`Generated file ID: ${fileId} for ${type}`);
    
    // Create a FormData object
    const formData = new FormData();
    
    // Append the file with proper name and type
    formData.append('file', {
      uri: file.uri,
      name: file.fileName || `${type}-${Date.now()}.${type === 'video' ? 'mp4' : 'jpg'}`,
      type: file.mimeType || (type === 'video' ? 'video/mp4' : 'image/jpeg')
    });
    
    console.log(`Created FormData for ${type} file upload`);

    // Use the SDK's createFile method with the pre-generated ID
    await storage.createFile(
      storageId,
      fileId,
      formData
    );

    console.log(`Successfully uploaded ${type} file to Appwrite with ID: ${fileId}`);

    // Skip trying to get the file ID from the response,
    // use the pre-generated ID directly
    let fileUrl;
    if (type === 'video') {
      fileUrl = storage.getFileView(storageId, fileId);
    } else {
      fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, 'top', 100);
    }
    
    console.log(`Generated URL for ${type}: ${fileUrl}`);
    return fileUrl;
    
  } catch (error) {
    console.error(`${type} upload failed:`, error);
    throw new Error(`Failed to upload ${type}: ${error.message}`);
  }
}

export const createVideo = async (form) => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'thumbnail'),
            uploadFile(form.video, 'video')
        ])

        const newPost = await databases.createDocument(
            databaseId, videoCollectionId, ID.unique(), 
            {
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                prompt: form.prompt,
                creator: form.creatorId
            }
        )

        return newPost;
    } catch (error) {
        throw new Error(error);
        
    }
}