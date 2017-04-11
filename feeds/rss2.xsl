<?xml version="1.0" encoding="UTF-8"?>
<!-- modified github.com/dotclear/dotclear/blob/master/inc/public/default-templates/legacy/rss2.xsl -->
<!-- gist.github.com/englishextra/acf31f209d0875c59b1c8fd532e25b87 -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" xmlns:content="http://purl.org/rss/1.0/modules/content/" version="1.0">
	<xsl:output method="html" />
	<xsl:template match="/">
		<html>
			<head>
				<title>
					<xsl:value-of select="/rss/channel/title" />
				</title>
			</head>
			<body>
				<div>
					<div>
						<h1>
							<a href="{/rss/channel/link}">
								<xsl:value-of select="/rss/channel/title" />
								<img src="{/rss/channel/image/url}" align="right" width="{/rss/channel/image/width}" height="{/rss/channel/image/height}" title="{/rss/channel/image/title}" alt="{/rss/channel/image/title}" />
							</a>
						</h1>
						<p>
							<xsl:value-of select="/rss/channel/description" />
						</p>
						<p>
							<xsl:value-of select="count(/rss/channel/item/link)" /> новых страниц.
						</p>
					</div>
					<hr />
					<div>
						<xsl:apply-templates select="//item" />
					</div>
					<hr />
					<div>
						<p align="right">
							<small>
								<em>
									<xsl:value-of select="/rss/channel/copyright" />
								</em>
							</small>
						</p>
					</div>
				</div>
			</body>
		</html>
	</xsl:template>
	<!-- Item template -->
	<xsl:template match="item">
		<div>
			<h2>
				<a href="{link}">
					<xsl:value-of select="title" />
				</a>
			</h2>
			<p>
				<small>
					<!-- http://help.hannonhill.com/discussions/xslt-formats/5547-formatting-rss-dates-with-format-datexsl -->
					<xsl:call-template name="format-date">
						<xsl:with-param name="date" select="pubDate"/>
					</xsl:call-template>
				</small>
			</p>
			<div>
				<xsl:value-of select="description" />
			</div>
			<p>
				<small>Категория: <xsl:value-of select="category" /><br />
				<a href="{comments}#disqus_thread">Комментарии</a></small>
			</p>
		</div>
	</xsl:template>
	<!-- http://sharepointtipandtrick.blogspot.ru/2013/02/xslt-for-formatting-pubdate-from-rss.html -->
	<xsl:template name="format-date">
		<xsl:param name="date"/>
		<xsl:variable name="day" select="substring-before(substring-after($date, ' '), ' ')"/>
		<xsl:variable name="day2" select="concat(translate(substring($day,1,1), '0', ''), substring($day,2,1))"/>
		<xsl:variable name="monthName" select="substring-before(substring-after(substring-after($date, ' '), ' '), ' ')"/>
		<xsl:variable name="year" select="substring-before(substring-after(substring-after(substring-after($date, ' '), ' '), ' '), ' ')"/>
		<xsl:variable name="month">
			<xsl:choose>
				<!-- <xsl:when test="$monthName = 'Jan'">January</xsl:when>
				<xsl:when test="$monthName = 'Feb'">February</xsl:when>
				<xsl:when test="$monthName = 'Mar'">March</xsl:when>
				<xsl:when test="$monthName = 'Apr'">April</xsl:when>
				<xsl:when test="$monthName = 'May'">May</xsl:when>
				<xsl:when test="$monthName = 'Jun'">June</xsl:when>
				<xsl:when test="$monthName = 'Jul'">July</xsl:when>
				<xsl:when test="$monthName = 'Aug'">August</xsl:when>
				<xsl:when test="$monthName = 'Sep'">September</xsl:when>
				<xsl:when test="$monthName = 'Oct'">October</xsl:when>
				<xsl:when test="$monthName = 'Nov'">November</xsl:when>
				<xsl:when test="$monthName = 'Dec'">December</xsl:when> -->
				<xsl:when test="$monthName = 'Jan'">января</xsl:when>
				<xsl:when test="$monthName = 'Feb'">февраля</xsl:when>
				<xsl:when test="$monthName = 'Mar'">марта</xsl:when>
				<xsl:when test="$monthName = 'Apr'">апреля</xsl:when>
				<xsl:when test="$monthName = 'May'">мая</xsl:when>
				<xsl:when test="$monthName = 'Jun'">июня</xsl:when>
				<xsl:when test="$monthName = 'Jul'">июля</xsl:when>
				<xsl:when test="$monthName = 'Aug'">августа</xsl:when>
				<xsl:when test="$monthName = 'Sep'">сентября</xsl:when>
				<xsl:when test="$monthName = 'Oct'">октября</xsl:when>
				<xsl:when test="$monthName = 'Nov'">ноября</xsl:when>
				<xsl:when test="$monthName = 'Dec'">декабря</xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<!-- <xsl:value-of select="concat($month, ' ', $day2, ', ', $year)"/> -->
		<xsl:value-of select="concat($day2, ' ',$month,  ' ', $year, ' г.')"/>
	</xsl:template>
</xsl:stylesheet>
