package com.contoso.socialapp.repository;

import com.contoso.socialapp.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, String> {
}
