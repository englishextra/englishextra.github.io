<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" exclude-result-prefixes="xhtml feedburner" xmlns:feedburner="http://rssnamespace.org/feedburner/ext/1.0" xmlns:xhtml="http://www.w3.org/1999/xhtml">
	<xsl:output method="html" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"/>
	<xsl:variable name="godecoding">go_decoding();</xsl:variable>
	<xsl:variable name="title" select="/rss/channel/title"/>
	<xsl:variable name="feedUrl" select="/rss/channel/atom10:link[@rel='self']/@href" xmlns:atom10="http://www.w3.org/2005/Atom"/>
	<xsl:template match="/">
		<xsl:element name="html">
			<xsl:attribute name="id">podcast</xsl:attribute>
			<head>
				<title>
					<xsl:value-of select="$title"/></title>
				<link href="/feeds/undohtml.css" rel="stylesheet" type="text/css" media="all"/>
				<link href="/feeds/bf30.css" rel="stylesheet" type="text/css" media="all"/>
				<link rel="alternate" type="application/rss+xml" title="{$title}" href="{$feedUrl}"/>
				<!-- <xsl:element name="script">
					<xsl:attribute name="type">text/javascript</xsl:attribute>
					<xsl:attribute name="src">//feedburner.google.com/fb/feed-styles/bf30.js</xsl:attribute>
				</xsl:element> -->
			</head>
			<xsl:apply-templates select="rss/channel"/>
		</xsl:element>
	</xsl:template>
	<xsl:template match="channel">
		<body id="podcast">
			<div id="cometestme" style="display:none;">
				<xsl:text disable-output-escaping="yes">&amp;amp;</xsl:text>
			</div>
			<div id="bodycontainer">
				<div id="bannerblock">
					<xsl:apply-templates select="image"/>
					<h1>
						<xsl:choose>
							<xsl:when test="link">
								<a href="{link}" title="Link to original website">
									<xsl:value-of select="$title"/>
								</a>
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="$title"/>
							</xsl:otherwise>
						</xsl:choose>
					</h1>
					<!-- <h2>A <span style="color:#E33906">podcast</span> powered by FeedBurner</h2> -->
					<p style="clear:both"/>
				</div>
				<div id="bodyblock">
					<div id="subscribenow" class="subscribeblock action">
						<div id="subscribe-userchoice" style="display:none">
							<p id="subscribeLink">
								<a href="#">...</a>
							</p>
							<p id="resetLink">Reset this favorite; <a href="#" onclick="return clearUserchoice('podcast')">show all Subscribe options</a>
							</p>
						</div>
						<div id="subscribe-options">
							<h3>Subscribe Now!</h3>
							<p class="desktopsub">
								<form>
									<input id="text" type="text" value="{$feedUrl}"/>
								</form>
							</p>
							<xsl:choose>
								<xsl:when test="feedburner:xmlView">
									<xsl:variable name="originalHref" select="/rss/channel/feedburner:xmlView/@href"/>
									<p>
										<!-- <a href="{$originalHref}">
											<img src="//feedburner.google.com/fb/lib/images/icons/feed-icon-12x12-orange.gif" alt="original feed"/>
										</a> -->
										<xsl:text> </xsl:text><a href="{$originalHref}">View Feed XML</a>
									</p>
								</xsl:when>
								<xsl:otherwise>
									<!-- purely for spacing -->
									<p>
										<xsl:text> </xsl:text>
									</p>
								</xsl:otherwise>
							</xsl:choose>
						</div>
						<input id="savechoice" type="hidden" value="podcast"/>
					</div>
					<p class="about">A podcast is rich media, such as audio or video, distributed via RSS. Feeds like this one provide updates whenever there is new content. FeedBurner makes it easy to receive content updates in popular podcatchers.</p>
					<!-- <p class="about">
						<a href="https://support.google.com/feedburner/answer/79408">Learn more about syndication and FeedBurner...</a>
					</p> -->
					<xsl:apply-templates select="feedburner:browserFriendly"/>
					<xsl:apply-templates select="item"/>
				</div>
				<div id="footer">
					<p>© 2006—2017 englishextra</p>
				</div>
			</div>
		</body>
	</xsl:template>
	<xsl:template match="feedburner:feedFlare">
		<xsl:variable name="alttext" select="."/>
		<a href="{@href}" onclick="this.href = subscribeNowUltra(this.href,'{$alttext}');return true">
			<img src="{@src}" alt="{$alttext}"/>
		</a>
	</xsl:template>
	<xsl:template match="item" xmlns:dc="http://purl.org/dc/elements/1.1/">
		<xsl:if test="position() = 1">
			<h3 id="currentFeedContent">Current Feed Content</h3>
		</xsl:if>
		<ul>
			<li class="regularitem">
				<h4 class="itemtitle">
					<xsl:choose>
						<xsl:when test="guid[@isPermaLink='true' or not(@isPermaLink)]">
							<a href="{guid}">
								<xsl:value-of select="title"/>
							</a>
						</xsl:when>
						<xsl:when test="link">
							<a href="{link}">
								<xsl:value-of select="title"/>
							</a>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="title"/>
						</xsl:otherwise>
					</xsl:choose>
				</h4>
				<h5 class="itemposttime">
					<xsl:if test="count(child::pubDate)=1">
						<span>Posted:</span>
						<xsl:text> </xsl:text>
						<xsl:value-of select="pubDate"/>
					</xsl:if>
					<xsl:if test="count(child::dc:date)=1">
						<span>Posted:</span>
						<xsl:text> </xsl:text>
						<xsl:value-of select="dc:date"/>
					</xsl:if>
				</h5>
				<xsl:if test="count(child::enclosure)=1">
					<p class="podcastmediaenclosure">
						<a href="{enclosure/@url}">Play Now</a>
					</p>
				</xsl:if>
				<div class="itemcontent" name="decodeable">
					<xsl:call-template name="outputContent"/>
				</div>
			</li>
		</ul>
	</xsl:template>
	<xsl:template match="image">
		<a href="{link}" title="Link to original website">
			<img src="{url}" id="feedimage" alt="{title}"/>
		</a>
		<xsl:text/>
	</xsl:template>
	<xsl:template match="feedburner:browserFriendly">
		<p class="about">
			<span style="color:#000">A message from the podcast publisher:</span>
			<xsl:text> </xsl:text>
			<xsl:apply-templates/>
		</p>
	</xsl:template>
	<xsl:template name="replaceAdSpace">
		<xsl:param name="body"/>
		<xsl:choose>
			<xsl:when test="contains($body, '&lt;p&gt;&lt;a href=&quot;http://feedads.g.doubleclick.net/~a')">
				<xsl:value-of select="substring-before($body, '&lt;a href=&quot;http://feedads.g.doubleclick.net/~a')"/>
				<xsl:text disable-output-escaping="yes">&lt;iframe src="http://feedads.g.doubleclick.net/~ah/</xsl:text>
				<xsl:value-of select="substring-before(substring-after(substring-after($body, '&lt;p&gt;&lt;a href=&quot;http://feedads.g.doubleclick.net/~a'), '/'), '/')"/>
				<xsl:text disable-output-escaping="yes">/h?w=300&amp;h=250&amp;src=bf" width="100%" height="250" frameborder="0" scrolling="no" style="margin-top:1em"&gt;&lt;/iframe&gt;</xsl:text>
				<xsl:value-of select="substring-after(substring-after(substring-after($body, '&lt;p&gt;&lt;a href=&quot;http://feedads.g.doubleclick.net/~a'), '/1/da'), '&lt;/a&gt;')"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$body"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="outputContent">
		<xsl:choose>
			<xsl:when test="xhtml:body">
				<xsl:copy-of select="xhtml:body/*"/>
			</xsl:when>
			<xsl:when test="xhtml:div">
				<xsl:copy-of select="xhtml:div"/>
			</xsl:when>
			<xsl:when xmlns:content="http://purl.org/rss/1.0/modules/content/" test="content:encoded">
				<xsl:value-of select="content:encoded" disable-output-escaping="yes"/>
			</xsl:when>
			<xsl:when test="description">
				<xsl:variable name="itemBody">
					<xsl:call-template name="replaceAdSpace">
						<xsl:with-param name="body" select="description"/>
					</xsl:call-template>
				</xsl:variable>
				<xsl:value-of select="$itemBody" disable-output-escaping="yes"/>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>
