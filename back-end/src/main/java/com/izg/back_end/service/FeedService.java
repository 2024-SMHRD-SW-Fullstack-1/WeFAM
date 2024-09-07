package com.izg.back_end.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.izg.back_end.dto.FeedDetailDto;
import com.izg.back_end.model.FeedModel;
import com.izg.back_end.model.FileModel;
import com.izg.back_end.model.PollModel;
import com.izg.back_end.model.UserModel;
import com.izg.back_end.repository.FeedRepository;
import com.izg.back_end.repository.FileRepository;
import com.izg.back_end.repository.UserRepository;

@Service
public class FeedService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	FeedRepository feedRepository;

	@Autowired
	private FileRepository fileRepository;

	@Transactional
	public FeedModel addFeed(FeedModel fm) {
		return feedRepository.save(fm);
	}

	// 피드에서 이미지 업로드하여 피드 추가
	@Transactional
	public void addFeedWithImages(int familyIdx, String userId, String entityType, int entityIdx,
			List<String> fileNames, List<String> fileExtensions, List<Long> fileSizes, List<MultipartFile> images,
			String content, String location) throws IOException {
		// 1. 피드 정보 저장
		FeedModel feed = new FeedModel();
		feed.setFamilyIdx(familyIdx);
		feed.setUserId(userId);
		feed.setFeedContent(content);
		feed.setFeedLocation(location);
		feed = feedRepository.save(feed);

		entityIdx = feed.getFeedIdx(); // 저장된 FeedModel에서 기본키 가져오기

		// 2. 파일 정보 저장
		for (int i = 0; i < images.size(); i++) {
			MultipartFile file = images.get(i);

			String fileName = fileNames.get(i);
			String fileExtension = fileExtensions.get(i);
			Long fileSize = fileSizes.get(i);

			FileModel fileModel = new FileModel();
			fileModel.setFamilyIdx(familyIdx);
			fileModel.setUserId(userId);
			fileModel.setEntityType(entityType);
			fileModel.setEntityIdx(entityIdx);
			fileModel.setFileRname(fileName);
			fileModel.setFileUname(fileName + "_" + Instant.now().toEpochMilli());
			fileModel.setFileSize(fileSize);
			fileModel.setFileExtension(fileExtension);
			fileModel.setFileData(file.getBytes()); // LONG BLOB 데이터

			fileRepository.save(fileModel);
		}
	}

	@Transactional(readOnly = true)
	public List<FeedModel> getAllFeeds(int familyIdx) {
		return feedRepository.findByFamilyIdxOrderByPostedAtDesc(familyIdx);
	}

	@Transactional(readOnly = true)
	public List<FileModel> getFilesByFeedIdx(Integer feedIdx) throws IOException {
		return feedRepository.findFilesByFeedIdx(feedIdx);
	}

//	@Transactional(readOnly = true)
//	public FeedModel getFeedDetail(int feedIdx) {
//		return feedRepository.findById(feedIdx).orElseThrow();
//	}

	@Transactional(readOnly = true)
	public FeedDetailDto getFeedDetail(int feedIdx) {
		FeedModel feed = feedRepository.findById(feedIdx)
				.orElseThrow(() -> new IllegalArgumentException("피드를 찾을 수 없습니다."));

		UserModel user = userRepository.findById(feed.getUserId())
				.orElseThrow(() -> new IllegalArgumentException("피드 작성자를 찾을 수 없습니다."));

		// FeedModel과 User 엔티티에서 DTO로 변환
		FeedDetailDto feedDetailDto = new FeedDetailDto();
		feedDetailDto.setFeedIdx(feed.getFeedIdx());
		feedDetailDto.setProfileImg(user.getProfileImg());
		feedDetailDto.setUserId(user.getId());
		feedDetailDto.setNick(user.getNick());
		feedDetailDto.setFeedContent(feed.getFeedContent());
		feedDetailDto.setFeedLocation(feed.getFeedLocation());
		feedDetailDto.setPostedAt(feed.getPostedAt());

		return feedDetailDto;
	}

	@Transactional
	public void updateFeed(int feedIdx, String feedContent) {
		FeedModel fm = feedRepository.findById(feedIdx).orElseThrow();
		fm.setFeedContent(feedContent);
		// 더티 체킹 : save를 호출하지 않아도 트랜잭션이 끝날 때 자동으로 업데이트.
		// 그러나 명시적으로 save를 호출하는 것을 권장하는 경우도 있음.
		feedRepository.save(fm);
	}

	@Transactional
	public void deleteFeed(int feedIdx) {
		// 먼저 파일을 삭제
		fileRepository.deleteByEntityTypeAndEntityIdx("feed", feedIdx);

		// 이후 피드를 삭제
		feedRepository.deleteById(feedIdx);
	}
}