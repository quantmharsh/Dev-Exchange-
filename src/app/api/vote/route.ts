"use server";

import {
	answerCollection,
	db,
	questionCollection,
	voteCollection,
} from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

export async function POST(request: NextRequest) {
	try {
		const { votedById, type, typeId, voteStatus } = await request.json();
		//list all documents
		const response = await databases.listDocuments(db, voteCollection, [
			Query.equal("votedById", votedById),
			Query.equal("type", type),
			Query.equal("typeId", typeId),
		]);
		//if we get the response this means user have already voted . so now we will remove its vote
		if (response.documents.length > 0) {
			//getting $id from appwrite it is document id
			await databases.deleteDocument(
				db,
				voteCollection,
				response.documents[0].$id
			);
			//Since vote is reduced now reduce the reputation of user on   whose qna  vote was reduced
			const questionAnswer = await databases.getDocument(
				db,
				type === "question" ? questionCollection : answerCollection,
				typeId
			);
			const authorPrefs = await users.getPrefs<UserPrefs>(
				questionAnswer.authorId
			);
			await users.updatePrefs<UserPrefs>(questionAnswer.authorId, {
				reputation:
					response.documents[0].voteStatus === "voted"
						? Number(authorPrefs.reputation) - 1
						: Number(authorPrefs.reputation) + 1,
			});
		}

		//if for ex user has send votestatus as upvote but in db it is stored as downvote
		//or user has not voted it till now  . then we will create new vote document
		if (response.documents[0]?.voteStatus !== voteStatus) {
			const doc = await databases.createDocument(
				db,
				voteCollection,
				ID.unique(),
				{
					type,
					typeId,
					voteStatus,
					votedById,
				}
			);
			//Increase or decrease the  reputation
			const questionAnswer = await databases.getDocument(
				db,
				type === "question" ? questionCollection : answerCollection,
				typeId
			);
			const authorPrefs = await users.getPrefs<UserPrefs>(
				questionAnswer.authorId
			);
			// if vote was present
			if (response.documents[0]) {
				await users.updatePrefs<UserPrefs>(questionAnswer.authorId, {
					reputation:
						// that means prev vote was "upvoted" and new value is "downvoted" so we have to decrease the reputation
						response.documents[0].voteStatus === "upvoted"
							? Number(authorPrefs.reputation) - 1
							: Number(authorPrefs.reputation) + 1,
				});
			} else {
				await users.updatePrefs<UserPrefs>(questionAnswer.authorId, {
					reputation:
						// that means prev vote was "upvoted" and new value is "downvoted" so we have to decrease the reputation
						voteStatus === "upvoted"
							? Number(authorPrefs.reputation) + 1
							: Number(authorPrefs.reputation) - 1,
				});
			}
		}

		//returning the total count of  votes
		const [upvotes, downvotes] = await Promise.all([
			databases.listDocuments(db, voteCollection, [
				Query.equal("votedById", votedById),
				Query.equal("type", type),
				Query.equal("typeId", typeId),
				Query.equal("voteStatus", "upvoted"),
				Query.limit(1),
			]),
			databases.listDocuments(db, voteCollection, [
				Query.equal("votedById", votedById),
				Query.equal("type", type),
				Query.equal("typeId", typeId),
				Query.equal("voteStatus", "downvoted"),
				Query.limit(1),
			]),
		]);
		return NextResponse.json(
			{
				data: {
					document: null,
					voteResult: (upvotes.total = downvotes.total),
				},
				message: "Voted  successfully",
			},
			{
				status: 201,
			}
		);
	} catch (error: any) {
		return NextResponse.json(
			{
				message: error?.message || "Error occured while voting",
			},
			{
				status: error?.status || 500,
			}
		);
	}
}
